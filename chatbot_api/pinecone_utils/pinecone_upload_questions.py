import pinecone
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set your Pinecone API key and environment
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "your-pinecone-api-key")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east1-gcp")  # Change if needed
INDEX_NAME = "ecommerce-questions"

# Example question bank for your electronics store
question_bank = [
    {"id": "1", "question": "What is your return policy?", "answer": "please note: this app is a demo and all products shown are hypothetical; no real purchases or returns are possible."},
    {"id": "2", "question": "Do you offer free shipping?", "answer": "In this demo app, all products and transactions are hypothetical and for demonstration purposes only."},
    {"id": "3", "question": "How can I track my order?", "answer": "Please note, this is a demonstration and no real orders or shipments are processed."},
    #{"id": "4", "question": "What products are available?", "answer": "Available product categories in this store are electronics, Books, Clothing, Home & Kitchen, Toys, Sports, Beauty."},
    {"id": "5", "question": "Can I change my shipping address after placing an order?", "answer": "Since this is a demonstration, no real orders or address changes are processed."},
    # Identity and app questions
    {"id": "39", "question": "Who are you?", "answer": "I am ShopBot, an intelligent, friendly, and polite AI assistant for this online electronics store demo. My purpose is to help users explore the store, learn about its products, and answer common questions."},
    {"id": "40", "question": "What is this app doing?", "answer": "This app is a demonstration of a modern e-commerce platform with integrated AI chatbot support. It showcases how conversational AI can enhance customer experience and assist with shopping in an online electronics store."},
    {"id": "6", "question": "Who created this app?", "answer": "This app was created by Bhathiya Gamage. Bhathiya is a data science graduate with a background in engineering and a strong passion for technology, AI, and software development."},
    {"id": "7", "question": "What is the purpose of this app?", "answer": "The purpose of this app is to serve as a demo for a modern e-commerce platform with integrated AI chatbot support. It showcases how conversational AI can enhance customer experience, answer questions, and assist with shopping in an online electronics store."},
    {"id": "8", "question": "What are the future work of this app?", "answer": "Planned future work includes: 1) Adding more advanced AI features such as personalized recommendations and natural language order management, 2) Integrating with additional payment and shipping providers, 3) Improving the chatbot with more training data and advanced models, and 4) Migrating to a microservices architecture for better scalability and maintainability."},
    {"id": "9", "question": "What is the tech stack used in this app?", "answer": "The app uses React for the frontend user interface, Flask for the backend API, PostgreSQL as the main database, Docker for containerization, and Hugging Face Transformers (GPT-2) for natural language processing. Pinecone is used for semantic search in the chatbot's question bank."},
    # Additional demo-focused questions
    {"id": "10", "question": "What payment methods do you accept?", "answer": "This app is a demo and does not process real payments. Payment methods are shown for demonstration purposes only."},
    {"id": "11", "question": "How do I create an account?", "answer": "Account creation is simulated in this demo app. No real accounts are created or stored."},
    {"id": "12", "question": "Can I cancel my order?", "answer": "Order cancellation is not implemented. No real orders are placed or cancelled."},
    {"id": "13", "question": "How do I contact customer support?", "answer": " No real support team is available."},
    {"id": "14", "question": "Do you have a physical store location?", "answer": "This is a demo app for an online store only. There is no physical store location."},
    {"id": "15", "question": "How do I reset my password?", "answer": "Account creation is not enabledNo real user data or passwords are stored."},
    {"id": "16", "question": "Are there any current promotions or discounts?", "answer": "No promotions and discounts shown and not valid for real purchases."},
    {"id": "17", "question": "How do I write a product review?", "answer": "Product reviews are simulated in this demo app."},
    {"id": "18", "question": "Can I get a student or military discount?", "answer": "No real discounts are available."},
    {"id": "19", "question": "How do I subscribe to your newsletter?", "answer": "No emails are sent or collected."},
    {"id": "20", "question": "How do I know if a product is in stock?", "answer": "Product availability is simulated for demonstration. No real inventory is managed."},
    {"id": "21", "question": "Can I request a product that is not listed?", "answer": "Product requests are not processed in this demo. All products are hypothetical."},
    {"id": "22", "question": "Do you sell refurbished or used electronics?", "answer": "Product types are shown for demonstration only. No real products are sold."},
    {"id": "24", "question": "What warranty do your products have?", "answer": "Warranty is not included in the product details and not considered for this app."},
    {"id": "25", "question": "How long does shipping take?", "answer": "No shipping times are not shown. No real shipping occurs."},
    {"id": "26", "question": "Do you ship internationally?", "answer": "No real shipments are made."},
    {"id": "27", "question": "Can I choose a delivery date?", "answer": "Delivery date selection is a not simulated feature for this demo app."},
    {"id": "28", "question": "What should I do if my order is damaged or missing?", "answer": "Orders are simulated in this demo. No real orders or shipments are processed."},
    {"id": "29", "question": "How do I start a return?", "answer": "No real shipping or returns are processed."},
    {"id": "30", "question": "How long does it take to process a refund?", "answer": "No refunds are issued."},
    {"id": "31", "question": "Are there any items that cannot be returned?", "answer": "No real products or returns exist."},
    {"id": "32", "question": "Is my personal information safe?", "answer": "This demo app does not collect or store any real personal information."},
    {"id": "33", "question": "How do I update my account information?", "answer": "Account updates are not simulated in this demo. No real user data is stored or updated."},
    {"id": "34", "question": "Can I delete my account?", "answer": "No account creation or data collection is performed. No real accounts exist."},
    {"id": "35", "question": "Is this a real store?", "answer": "No, this is a demo app for demonstration purposes only."},
    {"id": "36", "question": "Can I make a real purchase here?", "answer": "No, all purchases and transactions in this app are simulated for demonstration only."},
    {"id": "37", "question": "Is my payment information stored?", "answer": "No payment information is collected or stored in this demo app."},
    {"id": "38", "question": "Who can I contact for feedback about this demo?", "answer": "For feedback about this demo app, please contact Bhathiya Gamage, the developer. github link :https://github.com/Bath1988/Demo_Ecommerce_App."},

]


# Initialize Pinecone client (v3+)
pc = pinecone.Pinecone(api_key=PINECONE_API_KEY)

# Create index if it doesn't exist (v3+)
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

# Delete all vectors from the index before uploading new ones
index.delete(delete_all=True)

# Load sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings and upsert to Pinecone
vectors = []
for item in question_bank:
    embedding = model.encode(item["question"]).tolist()
    vectors.append((item["id"], embedding, {"question": item["question"], "answer": item["answer"]}))


# Upsert vectors using the new SDK
index.upsert(vectors=vectors)

print("Question bank uploaded to Pinecone!")
