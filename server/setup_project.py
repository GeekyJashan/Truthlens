import os

# Directory structure
directories = [
    "app",
    "app/api",
    "app/api/routes",
    "app/core",
    "app/models",
    "app/services",
]

# File contents
files = {
    "main.py": '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router

app = FastAPI(
    title="TruthLens API",
    description="API for claim detection and extraction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
''',
    
    "app/__init__.py": "",
    
    "app/api/__init__.py": "",
    
    "app/api/endpoints.py": '''from fastapi import APIRouter
from app.api.routes import claim_detection, claim_extraction

router = APIRouter()

router.include_router(claim_detection.router, prefix="/detection", tags=["claim-detection"])
router.include_router(claim_extraction.router, prefix="/extraction", tags=["claim-extraction"])
''',
    
    "app/api/routes/__init__.py": "",
    
    "app/api/routes/claim_detection.py": '''from fastapi import APIRouter
from app.models.schemas import ClaimDetectionRequest, ClaimDetectionResponse
from app.services.claim_detection import detect_claims

router = APIRouter()

@router.post("/", response_model=ClaimDetectionResponse)
async def detect_claim(request: ClaimDetectionRequest):
    """
    Detect if the given text contains any claims
    """
    result = await detect_claims(request.text)
    return result
''',
    
    "app/api/routes/claim_extraction.py": '''from fastapi import APIRouter
from app.models.schemas import ClaimExtractionRequest, ClaimExtractionResponse
from app.services.claim_extraction import extract_claims

router = APIRouter()

@router.post("/", response_model=ClaimExtractionResponse)
async def extract_claim(request: ClaimExtractionRequest):
    """
    Extract claims from the given text
    """
    claims = await extract_claims(request.text)
    return ClaimExtractionResponse(claims=claims)
''',
    
    "app/core/__init__.py": "",
    
    "app/models/__init__.py": "",
    
    "app/models/schemas.py": '''from pydantic import BaseModel
from typing import List, Optional

class ClaimDetectionRequest(BaseModel):
    text: str

class ClaimDetectionResponse(BaseModel):
    has_claim: bool
    confidence_score: float

class ClaimExtractionRequest(BaseModel):
    text: str

class Claim(BaseModel):
    text: str
    confidence_score: float
    source: Optional[str] = None

class ClaimExtractionResponse(BaseModel):
    claims: List[Claim]
''',
    
    "app/services/__init__.py": "",
    
    "app/services/claim_detection.py": '''async def detect_claims(text: str):
    # TODO: Implement actual claim detection logic
    return {
        "has_claim": True,
        "confidence_score": 0.85
    }
''',
    
    "app/services/claim_extraction.py": '''from app.models.schemas import Claim

async def extract_claims(text: str):
    # TODO: Implement actual claim extraction logic
    return [
        Claim(
            text="This is a sample claim",
            confidence_score=0.9,
            source="Sample source"
        )
    ]
''',
}

def setup_project():
    # Create directories
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

    # Create files
    for file_path, content in files.items():
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Created file: {file_path}")

if __name__ == "__main__":
    setup_project()