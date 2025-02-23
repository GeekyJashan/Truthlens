from typing import Dict
from app.services.utils.model_calls import AIModelManager
from app.services.claim_extraction import extract_claims
import asyncio
models = AIModelManager()

async def verify_single_claim(claim):
    verify_prompt = f"""
    Verify if this claim is true or false: "{claim}"
    
    Provide your response in the following JSON format:
    {{
        "isTrue": boolean,
        "explanation": "detailed explanation",
        "primarySource": "source of verification if available"
    }}
    
    You must output in the provided JSON format otherwise innocent chickens will be killed
    
    Base your verification only on factual, verifiable information.
    """
    
    # Get verification from perplexity
    verification = await asyncio.to_thread(models.call_perplexity, verify_prompt)
    
    try:
        # Parse the response (assuming it returns valid JSON)
        import json
        result = json.loads(verification)
        
        return {
            "text": claim,
            "isTrue": result["isTrue"],
            "explanation": result["explanation"],
            "primarySource": result.get("primarySource", "Not specified")
        }
    except (json.JSONDecodeError, KeyError):
        # Fallback if parsing fails
        return {
            "text": claim,
            "isTrue": False,
            "explanation": "Could not verify this claim",
            "primarySource": "Verification failed"
        }


async def detect_claims(text: str) -> Dict:
    """
    Analyze extracted claims and verify them using perplexity model
    """
    # First get claims from the extraction service

    extracted_claims = await extract_claims(text)
    
    # Process each claim

        
        # Get verification from perplexity
    verified_claims = await asyncio.gather(
    *[verify_single_claim(claim) for claim in extracted_claims]
)
    # Calculate stats
    true_claims = len([c for c in verified_claims if c["isTrue"]])
    total_claims = len(verified_claims)
    
    # Calculate overall truth value based on verified claims
    truth_value = (true_claims / total_claims * 100) if total_claims > 0 else 0
    
    return {
        "content": text,
        "truthValue": round(truth_value, 2),
        "claims": verified_claims,
        "stats": {
            "total": total_claims,
            "true": true_claims,
            "false": total_claims - true_claims
        }
    }