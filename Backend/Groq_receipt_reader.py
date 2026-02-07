import base64
import os
import sys
import json
from groq import Groq
from dotenv import load_dotenv

# Get API key for Groq from .env file
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

# Encode image to base64, for processing by Groq
def encode_image(image_path):
    """Encodes the image to base64 so Groq can read it."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Using Groq API look at receipt image and extract grocery items into a simplified JSON list
def parse_receipt_with_groq(image_path):
    print(f"Uploading {image_path} to Groq...")
    
    base64_image = encode_image(image_path)

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-maverick-17b-128e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """
                            Look at this grocery receipt. 
                            Extract all grocery items into a simplified JSON list.
                            
                            Rules:
                            1. Ignore tax, totals, addresses, and store info.
                            2. Return ONLY valid JSON. No markdown formatting.
                            3. Simplify names (e.g., "lg eggs 12ct" -> "eggs". Look for keywords like "egg", "milk", "bread", etc.). But if there is specific items like "organic milk", "almond milk", "whole milk", etc, return those as is instead of simplifying to just "milk".
                            4. Ignore non-food items and snacks(e.g., "paper towels", "toilet paper", "shampoo", "cereal", "snackables", "lunchables", etc).
                            5. If quantity is specified, include it (e.g., "2x milk" -> "milk": 2, "12ct eggs" -> "eggs": 12, etc.). If not specified, assume quantity of 1.
                            6. If multiple of the same item, sum the quantity (e.g., "bread" appears 3 times, return "bread": 3).
                            
                            Expected Format:
                            {
                                "items": [
                                    {"item": "milk", "quantity": 1},
                                    {"item": "bread", "quantity": 2},
                                ]
                            }
                            """
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0,
            max_tokens=1024,
            stream=False,
            response_format={"type": "json_object"} 
        )

        result_text = completion.choices[0].message.content
        return json.loads(result_text)

    except Exception as e:
        print(f"Error: {e}")
        return None
