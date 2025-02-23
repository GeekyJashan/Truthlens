import asyncio
from asyncio.log import logger
from concurrent.futures import ThreadPoolExecutor
import json
from typing import List
import random

from app.services.utils.model_calls import AIModelManager

models=AIModelManager()
executor = ThreadPoolExecutor(max_workers=3)

async def extract_claims(text: str) -> List[str]:
    try:
        extracted_claims = await asyncio.get_event_loop().run_in_executor(
            executor, 
            models.call_claude, 
            text
        )
        print(extracted_claims)
        extracted_claims = json.loads(extracted_claims)
        return extracted_claims["claims"]
    except Exception as e:
        logger.error(f"Error in extract_claims: {str(e)}")
        return []