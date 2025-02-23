from fastapi import APIRouter
from app.models.schemas import ClaimAnalysisRequest, ClaimAnalysisResponse, Stats
from app.services.claim_detection import detect_claims

router = APIRouter()

@router.post("/analyze", response_model=ClaimAnalysisResponse)
async def analyze_text(request: ClaimAnalysisRequest):
    """
    Analyze text for claims and verify their truthfulness
    """
    result = await detect_claims(request.content)
    return result