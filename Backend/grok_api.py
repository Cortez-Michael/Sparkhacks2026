import os
import sys
import base64
from groq import Groq
from dotenv import load_dotenv

# Garb API key from .env file
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

# Encode image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Look at image with Groq API and return the name of the food as a json file
def analyze_groq(image_path):
    base64_image = encode_image(image_path)
    
    response = client.chat.completions.create(
        model="meta-llama/llama-4-maverick-17b-128e-instruct",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "What food is this (look closly to detail and distinguish)? Return JSON with name."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }]
    )
    print(response.choices[0].message.content)

if __name__ == "__main__":

    if len(sys.argv) > 1:
        first_arg = sys.argv[1]
    else:
        print("Error: Please provide an argument.")
        print(f"Usage: python {sys.argv[0]} <your_argument>")
        sys.exit(1) 

    analyze_groq(first_arg)