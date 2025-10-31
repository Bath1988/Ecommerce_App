from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pinecone

from sentence_transformers import SentenceTransformer

from db_utils import get_product_categories, format_categories_for_context


app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Pinecone setup (new SDK)
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "ecommerce-questions"
pc = pinecone.Pinecone(api_key=PINECONE_API_KEY)
try:
    indexes = [idx.name for idx in pc.list_indexes()]
    if INDEX_NAME not in indexes:
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,
            metric="cosine",
            spec=pinecone.ServerlessSpec(
                cloud="aws",  # or "gcp" if your environment is GCP
                region="us-east-1"  # match your Pinecone environment
            )
        )
except Exception as e:
    print(f"Error creating index: {e}")
index = pc.Index(INDEX_NAME)

# Embedding model for semantic search
embedder = SentenceTransformer('all-MiniLM-L6-v2')



# Set up OpenAI API key (new API)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)


# Function to build context with product data

def build_chatbot_context():
    """
    Builds an improved system prompt for the ShopBot assistant.
    Emphasizes product discovery, clear explanations, and demo transparency.
    """

    categories = get_product_categories()
    categories_line = format_categories_for_context(categories)

    return (
        "You are ShopBot — a friendly, intelligent AI assistant for an online sales store demo. "
        "Your main goal is to help users browse and learn about available products, provide information "
        "about product categories, features, and comparisons, and assist with general store-related questions. "
        "You can also explain store policies, orders, payments, and app details when relevant.\n\n"

        "Here’s what you should know about this app:\n"
        "- This is a **demo e-commerce platform** — no real orders, payments, or shipping occur.\n"
        "- All products and reviews are simulated, meant to demonstrate how conversational AI can improve user experience.\n"
        "- The app was developed by **Bhathiya Gamage**, a Data Science graduate and engineer passionate about AI and web development.\n"
        "- The tech stack includes **React (frontend)**, **Flask (backend)**, **PostgreSQL (database)**, **Docker (containers)**, "
        "**Pinecone (semantic vector database)**, and **Hugging Face Transformers** for natural language understanding.\n\n"

        "When answering product-related questions:\n"
        f"{categories_line}\n\n"
        "- Be helpful, concise, and conversational.\n"
        "- If a user asks about a type of product list the available product categories, describe typical features, advantages, and use cases.\n"
        "- You may also list or summarize products from the demo database below.\n"
        "- If the question is unrelated to the demo (like real transactions or unrelated topics), clarify politely that this is a simulation.\n\n"

        f"{categories_line}\n\n"

        "Tone and style:\n"
        "- Friendly, professional, and informative.\n"
        "- Avoid over-technical jargon unless the user asks for it.\n"
        "- Keep answers under 40 words unless detailed explanations are requested.\n\n"

        "If users ask about Bhathiya or the app itself, mention that this project was created to demonstrate how AI chatbots can improve "
        "e-commerce support and interactivity.\n\n"

        "Your goal: be a knowledgeable, approachable shopping assistant that helps users quickly find what they need."
    )



@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'response': "Please provide a message."}), 400
    # Enforce word limit
    if len(user_message.split()) > 40:
        return jsonify({'response': "Your message exceeds the maximum word limit of 40 words. Please shorten your prompt."}), 400

    # 1. Try Pinecone semantic search for FAQ
    user_embedding = embedder.encode(user_message).tolist()
    search_result = index.query(vector=user_embedding, top_k=1, include_metadata=True)
    matches = search_result.get('matches', [])
    if matches:
        best_match = matches[0]
        score = best_match.get('score', 0)
        answer = best_match.get('metadata', {}).get('answer', '')
        # You can adjust the threshold as needed (0.8 is a good start for cosine similarity)
        if score > 0.7 and answer:
            return jsonify({'response': answer})

    # 2. Fallback to GPT-3.5 if no good FAQ match
    chatbot_context = build_chatbot_context()
    print("[DEBUG] Chatbot context:\n", chatbot_context)
    try:
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
        # Limit the response to 40 words
        bot_reply_words = bot_reply.split()
        if len(bot_reply_words) > 40:
            bot_reply = ' '.join(bot_reply_words[:40])
        return jsonify({'response': bot_reply})
    except Exception as e:
        return jsonify({'response': f"Error generating response: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)

# Test block for context (run: python app.py)
if __name__ == "__main__":
    print("Testing build_chatbot_context()...")
    context = build_chatbot_context()
    print("\nChatbot context:\n")
    print(context)
