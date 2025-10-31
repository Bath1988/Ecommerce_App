import os
import requests

def get_product_categories(api_url=None):
    """
    Fetches product categories from the API.
    Default URL uses Docker service name 'api' for internal networking.
    """
    api_url = api_url or os.getenv("API_URL", "http://api:5000/api/categories")

    try:
        response = requests.get(api_url, timeout=5)
        response.raise_for_status()
        categories = response.json()
        return [cat.get("name", "Unknown") for cat in categories]
    except Exception as e:
        print(f"[WARNING] Could not fetch categories: {e}")
        return []


def format_categories_for_context(categories):
    """
    Formats category names for inclusion in the chatbot context.
    """
    if categories:
        categories_str = ", ".join(categories)
        return f"Available product categories in this store: {categories_str}."
    return "Product categories are currently unavailable."


if __name__ == "__main__":
    categories = get_product_categories()
    print("Categories:", categories)
    print("Formatted:", format_categories_for_context(categories))
