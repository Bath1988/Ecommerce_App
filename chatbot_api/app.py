from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI
import pinecone
from sentence_transformers import SentenceTransformer
from db_utils import get_product_categories, format_categories_for_context

# ----------------------------
# Flask & Config Setup
# ----------------------------
app = Flask(__name__)
CORS(app)
load_dotenv()

# ----------------------------
# Environment Variables
# ----------------------------
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX", "ecommerce-questions")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")

# ----------------------------
# Pinecone Setup
# ----------------------------
index = None
try:
    pc = pinecone.Pinecone(api_key=PINECONE_API_KEY)
    if INDEX_NAME not in [i.name for i in pc.list_indexes()]:
        print(f"[INFO] Creating Pinecone index: {INDEX_NAME}")
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,
            metric="cosine",
            spec=pinecone.ServerlessSpec(cloud="aws", region=PINECONE_REGION)
        )
    index = pc.Index(INDEX_NAME)
except Exception as e:
    print(f"[ERROR] Pinecone setup failed: {e}")

# ----------------------------
# Models
# ----------------------------
embedder = SentenceTransformer("all-MiniLM-L6-v2")
client = OpenAI(api_key=OPENAI_API_KEY)

# ----------------------------
# Helper Functions
# ----------------------------
def build_chatbot_context():
    """Builds a contextual system prompt for the ShopBot assistant."""
    categories = get_product_categories()
    categories_line = format_categories_for_context(categories)

    return (
        "You are ShopBot — a friendly, intelligent AI assistant for an online sales store demo.\n"
        "Your goal is to help users browse and learn about available products, categories, and features.\n\n"
        "Important details:\n"
        "- This is a demo app — no real transactions occur.\n"
        "- All products and reviews are simulated for demonstration purposes.\n"
        "- Built by Bhathiya Gamage, a Data Science graduate and engineer passionate about AI and web development.\n"
        "- Tech stack: React, Flask, PostgreSQL, Docker, Pinecone, openai GPT 3.5.\n\n"
        "- If user asked about the products mention {categories_line}"
        "- Give intelligent prompts about {categories_line} product categories where relevant.\n\n"

        f"{categories_line}\n\n"

        "Guidelines:\n"
        "- Be concise, friendly, and informative.\n"
        "- Keep responses under 40 words unless asked for more detail.\n"
        "- If users ask about Bhathiya or the project, explain it’s an demo ecommerce app integrated with language models.\n"
    )

# ----------------------------
# Chat Endpoint
# ----------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": "Please provide a message."}), 400

    if len(user_message.split()) > 40:
        return jsonify({"response": "Your message exceeds the 40-word limit. Please shorten it."}), 400

    # Try Pinecone semantic search
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
            print(f"[WARNING] Pinecone query failed: {e}")

    if answer:
        return jsonify({"response": answer})

    # Fallback: OpenAI Chat
    try:
        chatbot_context = build_chatbot_context()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": chatbot_context},
                {"role": "user", "content": user_message}
            ],
            max_tokens=100,
            temperature=0.7
        )
        bot_reply = response.choices[0].message.content.strip()
        bot_reply = " ".join(bot_reply.split()[:40])
        return jsonify({"response": bot_reply})
    except Exception as e:
        print(f"[ERROR] OpenAI request failed: {e}")
        return jsonify({"response": "Sorry, the chatbot is temporarily unavailable."}), 500

# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
