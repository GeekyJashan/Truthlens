from fastapi import APIRouter
from app.api.routes.claim_extraction import router as claim_router
from app.api.routes.scraper import router as scrape_router
from app.api.routes.doc_parse import router as parse_doc_router

router = APIRouter()
router.include_router(claim_router)
router.include_router(scrape_router)
router.include_router(parse_doc_router)