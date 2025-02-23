import os
from typing import Optional
from urllib.parse import urlparse
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)


CLIENT_SCRAPE_URL = os.getenv("CENTRAL_SCRAPING_SERVICE_SLOW_API_URL")
SERVER_SCRAPE_URL = os.getenv("CENTRAL_SCRAPING_SERVICE_API_URL")

def validate_url(url: str) -> bool:
    """Validate if string is a valid URL.
    
    Args:
        url (str): The URL to validate.
    
    Returns:
        bool: True if valid URL, False otherwise.
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

async def scrape_content(url: str) -> str:
    """Scrape content from a URL using central scraping service.
    
    Args:
        url (str): The URL to scrape.
    
    Returns:
        str: The scraped content.
        
    Raises:
        ValueError: If URL is invalid
        Exception: If both client and server scraping fail
    """
    if not url or not validate_url(url):
        raise ValueError("Invalid URL provided")

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": os.getenv("CENTRAL_SCRAPING_SERVICE_API_KEY"),
    }

    data = {
        "url": url,
        "is_paid_fallback_needed": True,
        "should_special_parse_articles": True,
        "is_ai_parsing_needed": True,
        "include_images": False,
        "include_formatting": True,
        "should_check_for_pdf_and_doc": True,
        "only_return_from_cache": False,
        "should_proxy_request": True,
        "use_jina": False,
        "get_raw_html": False,
        "ignore_cache": False,
    }

    async with httpx.AsyncClient() as client:
        try:
            # Attempt client-side scraping
            client_response = await client.post(
                CLIENT_SCRAPE_URL, 
                json=data,
                headers=headers,
                timeout=30.0
            )
            client_response.raise_for_status()
            if client_response.json().get("content"):
                return client_response.json()["content"]
            raise Exception("Client-side scraper returned no content.")
            
        except Exception as client_error:
            print(f"Client-side scraper failed: {str(client_error)}")

            try:
                # Fallback to server-side scraping
                server_response = await client.post(
                    SERVER_SCRAPE_URL,
                    json=data, 
                    headers=headers,
                    timeout=30.0
                )
                server_response.raise_for_status()
                if server_response.json().get("content"):
                    return server_response.json()["content"]
                raise Exception("Server-side scraper returned no content.")
                
            except Exception as server_error:
                print(f"Server-side scraper failed: {str(server_error)}")
                raise server_error