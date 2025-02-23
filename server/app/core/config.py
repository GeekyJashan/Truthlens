from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Keys
    OPENAI_API_KEY: str
    OPENROUTER_API_KEY: str
    PERPLEXITY_API_KEY: str
    ANTHROPIC_API_KEY: str
    
    # Service URLs
    PROXY_URL: str
    CENTRAL_SCRAPING_SERVICE_API_KEY: str
    CENTRAL_SCRAPING_SERVICE_API_URL: str
    CENTRAL_SCRAPING_SERVICE_SLOW_API_URL: str
    
    # Search API Keys
    SERP_API_KEY: str
    SERPER_API_KEY: str
    
    # API Base URLs
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    PERPLEXITY_BASE_URL: str = "https://api.perplexity.ai"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()