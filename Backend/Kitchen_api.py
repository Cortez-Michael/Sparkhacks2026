from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import base64
import json
import os
import grok_api
import Groq_receipt_reader
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

app = FastAPI()

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/scan-receipt/")
async def scan_receipt(file: UploadFile = File(...)):
    image_bytes = await file.read()

    result = Groq_receipt_reader.parse_receipt_with_groq(image_bytes)

    if result is None:
        raise HTTPException(status_code=500, detail="Groq API returned no data.")

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result