from openai import OpenAI


async def call_gpt(query, urls):

    detect_prompt = f'''
    Identify and list any factual claims in the following text:\n{input_text}\n

    Consider all the numerical data, dates, years of establishment, historical facts. Each numeric figure is actually a factual claim
    which can be proven true or false

    Donot make things up

    !IMPORTANT: You cannot change or make up a line.The claim should be exactly the same line present in the article
    Strictly adhere to the article lines. Just fetch the whole line if there is some factual claim inside it.

    Example:
    Source paragraph:
    Hydroelectric power has been around for centuries, with the first plant built in the United States in 1882.
    It currently accounts for 16% of global electricity production and is considered the most reliable source among all renewable energies.

    Detected Claims:
    Hydroelectric power has been around for centuries, with the first plant built in the United States in 1882.
    It currently accounts for 16% of global electricity production and is considered the most reliable source among all renewable energies.


    Claims:


    '''
    
    print(detect_prompt)
    
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": detect_prompt},
        ],
        temperature=0.0  
    )
    return response.choices[0].message.content