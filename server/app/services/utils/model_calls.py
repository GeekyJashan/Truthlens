import os
import anthropic
from openai import OpenAI
import logging

from dotenv import load_dotenv
load_dotenv(override=True)
logger = logging.getLogger(__name__)

class AIModelManager:
    def __init__(self):
        # Initialize API keys
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        self.perplexity_api_key = os.getenv('PERPLEXITY_API_KEY')
        self.anthropic_key = os.getenv('ANTHROPIC_API_KEY')
        
        # Initialize clients
        self.openai_client = OpenAI(
            api_key=self.openai_api_key,
        )
        self.perplexity_client = OpenAI(
            api_key=self.perplexity_api_key, 
            base_url="https://api.perplexity.ai"
        )
        self.claude_client = anthropic.Anthropic(
            api_key=self.anthropic_key
        )

    def call_gpt(self, query):
        prompt = f'''
        
        '''
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.0  
        )
        return response.choices[0].message.content

    def call_perplexity(self, prompt):
        
        messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
        ]
        completion = self.perplexity_client.chat.completions.create(
            model="sonar-pro",
            messages=messages
        )
        return completion.choices[0].message.content

    def call_claude(self, input_text):
        main_prompt = f"""
        Identify and list any factual claims in the following text:\n{input_text}\n

    Consider all the numerical data, dates, years of establishment, historical facts. Each numeric figure is actually a factual claim
    which can be proven true or false

    Donot make things up

    !IMPORTANT: You cannot change or make up a line.The claim should be exactly the same line present in the article
    Strictly adhere to the article lines. Just fetch the whole line if there is some factual claim inside it.
    
    Output the claims in the following JSON format:
    {{
        "claims": [
            "claim 1",
            "claim 2",
            ...
        ]
    }}
    
    If its one line in the text, just output it as claim.


    Example input:
    Hydroelectric power has been around for centuries, with the first plant built in the United States in 1882.
    It currently accounts for 16% of global electricity production and is considered the most reliable source among all renewable energies.

    Example output:
    {{
        "claims": [
            "Hydroelectric power has been around for centuries, with the first plant built in the United States in 1882.",
            "It currently accounts for 16% of global electricity production and is considered the most reliable source among all renewable energies."
        ]
    }}
    
    You must output in the provided format.
    If there are no claims, return: {{"claims": []}}
    Nothing else apart from the provided json should be outputted.

        """
        
        response = self.claude_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8100,
            system="You are an expert at extracting claims made in text.",
            messages=[
                {"role": "user", "content": main_prompt},
            ],
            temperature=0.0
        )
        print(response.content[0].text)
        text = response.content[0].text
        return text
    
    
    
if __name__=="__main__":
    
    manager = AIModelManager()
    
    # Test query
    test_query = "What is the capital of France?"
    
    print("Testing GPT:")
    gpt_response = manager.call_gpt(test_query)
    print(gpt_response)
    
    print("\nTesting Perplexity:")
    perplexity_response = manager.call_perplexity(test_query)
    print(perplexity_response)
    
    print("\nTesting Claude:")
    claude_response = manager.call_claude(test_query)
    print(claude_response)
    
    