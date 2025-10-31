import requests


def get_product_categories(api_url="http://localhost:5000/api/categories"):
    """
    Fetches product categories from the API endpoint.
    Returns a list of category names or an empty list if there's an error.
    """
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        categories = response.json()
        category_names = [cat['name'] for cat in categories]
        return category_names
    except Exception:
        return []


def format_categories_for_context(categories):
    """
    Formats a list of category names for inclusion in the OpenAI system prompt.
    Returns a single string, e.g.:
    'Available product categories in this store: Electronics, Books, Clothing.'
    """
    if categories:
        categories_str = ", ".join(categories)
        return f"Available product categories in this store: {categories_str}."
    else:
        return "Product categories are currently unavailable."


if __name__ == "__main__":
    categories = get_product_categories()
    print("Categories:", categories)
    formatted = format_categories_for_context(categories)
    print("Formatted for context:", formatted)
