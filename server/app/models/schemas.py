from pydantic import BaseModel
from typing import List

class Stats(BaseModel):
    total: int
    true: int
    false: int

class Claim(BaseModel):
    text: str
    isTrue: bool
    explanation: str
    primarySource: str

class ClaimAnalysisRequest(BaseModel):
    content: str

class ClaimAnalysisResponse(BaseModel):
    content: str
    truthValue: float
    claims: List[Claim]
    stats: Stats
    
class ScrapeRequest(BaseModel):
    url: str

class ScrapeResponse(BaseModel):
    content: str
