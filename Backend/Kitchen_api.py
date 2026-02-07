import os
import Groq_receipt_reader
import sqlite3
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, validator
from typing import List, Union, Optional


class Item(BaseModel):
    item: str
    quantity: Union[int, str] = 1 

    def quantity_to_string(cls, v):
        return str(v)

class ItemList(BaseModel):
    items: List[Item]


load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

app = FastAPI()

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

@app.post("/send-list/")
async def send_list(request: Request):
    data = await request.json()
    raw_items = data.get("items", [])
    
    conn = sqlite3.connect("User_database.db")
    cursor = conn.cursor()
    processed_ids = []

    try:
        for entry in raw_items:
            if isinstance(entry, str):
                name = entry
                qty = 1
            elif isinstance(entry, dict):
                name = entry.get("item") or entry.get("name") 
                qty = entry.get("quantity", 1)
            else:
                continue 

            if not name:
                continue 

            clean_name = name.strip().lower()
            
            cursor.execute("SELECT ingredient_id, quantity FROM pantry WHERE name = ?", (clean_name,))
            row = cursor.fetchone()

            if row:
                item_id, current_qty_str = row
                
                try:
                    current_qty = int(current_qty_str)
                    add_qty = int(qty)
                    new_qty = str(current_qty + add_qty)
                except ValueError:
                    new_qty = str(qty) 

                cursor.execute("UPDATE pantry SET quantity = ? WHERE ingredient_id = ?", (new_qty, item_id))
                processed_ids.append(item_id)
                
            else:
                cursor.execute("INSERT INTO pantry (name, quantity) VALUES (?, ?)", (clean_name, str(qty)))
                processed_ids.append(cursor.lastrowid)

        conn.commit()
        return {"message": "Success", "added_ids": processed_ids}

    except Exception as e:
        print(f"DATABASE ERROR: {e}")
        return {"error": str(e)}
    finally:
        conn.close()