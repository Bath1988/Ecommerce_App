from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from openai import OpenAI
import pinecone
from sentence_transformers import SentenceTransformer
from db_utils import get_product_categories, format_categories_for_context

# ----------------------------
# Setup
# ----------------------------
app = Flask(__name__)
CORS(app)
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# ----------------------------
# Environment Variables
# ----------------------------
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX", "ecommerce-questions")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")

# ----------------------------
# Initialize Services
# ----------------------------
index = None
try:
    pc = pinecone.Pinecone(api_key=PINECONE_API_KEY)
    existing_indexes = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing_indexes:
        logging.info(f"Creating Pinecone index: {INDEX_NAME}")
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,
            metric="cosine",
            spec=pinecone.ServerlessSpec(cloud="aws", region=PINECONE_REGION)
        )
    index = pc.Index(INDEX_NAME)
except Exception as e:
    logging.error(f"Pinecone setup failed: {e}")

embedder = SentenceTransformer("all-MiniLM-L6-v2")
client = OpenAI(api_key=OPENAI_API_KEY)

# ----------------------------
# Helpers
# ----------------------------
def build_chatbot_context():
    categories = get_product_categories()
    categories_line = format_categories_for_context(categories)

    return (
        "You are ShopBot — a friendly AI assistant for a demo online store.\n"
        "Help users browse simulated products and categories intelligently.\n"
        "- No real transactions happen.\n"
        "- All products are for demonstration only.\n"
        "- Built by Bathiya Gamage, a data science graduate passionate about AI.\n"
        "- Tech stack: React, Flask, PostgreSQL, Docker, Pinecone, OpenAI GPT-3.5.\n\n"
        f"Available categories: {categories_line}\n\n"
        "Guidelines:\n"
        "- Be concise (under 40 words).\n"
        "- Stay friendly, professional, and informative.\n"
        "- Mention product categories naturally where relevant.\n"
    )

# ----------------------------
# Routes
# ----------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": "Please provide a message."}), 400

    if len(user_message.split()) > 40:
        return jsonify({"response": "Your message exceeds 40 words. Please shorten it."}), 400

    # Semantic search
    answer = None
    if index:
        try:
            user_embedding = embedder.encode(user_message).tolist()
            result = index.query(vector=user_embedding, top_k=1, include_metadata=True)
            matches = result.get("matches", [])
            if matches:
                top = matches[0]
                score = top.get("score", 0)
                meta_answer = top.get("metadata", {}).get("answer", "")
                if score > 0.7 and meta_answer:
                    answer = meta_answer
        except Exception as e:
            logging.warning(f"Pinecone query failed: {e}")

    if answer:
        return jsonify({"response": answer})

    # Fallback: OpenAI
    try:
        chatbot_context = build_chatbot_context()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": chatbot_context},
                {"role": "user", "content": user_message},
            ],
            max_tokens=100,
            temperature=0.7,
        )
        bot_reply = response.choices[0].message.content.strip()
        bot_reply = " ".join(bot_reply.split()[:40])
        return jsonify({"response": bot_reply})
    except Exception as e:
        logging.error(f"OpenAI request failed: {e}")
        return jsonify({"response": "Sorry, the chatbot is temporarily unavailable."}), 500


@app.route("/health", methods=["GET"])
def health():
    """Simple health check for Docker Compose."""
    return jsonify({"status": "ok"}), 200


# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
