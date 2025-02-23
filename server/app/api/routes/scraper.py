from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraper import scrape_content
from app.models.schemas import ScrapeRequest, ScrapeResponse

router = APIRouter()


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_url(request: ScrapeRequest):
    """
    Scrape content from a given URL
    """
    try:
        content = await scrape_content(request.url)
        return ScrapeResponse(content=content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))