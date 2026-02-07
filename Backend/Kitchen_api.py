from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
from typing import List, Optional

import os
import Groq_receipt_reader
from dotenv import load_dotenv

from Create_user_db import get_db_connection, init_db

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)


class ItemEntry(BaseModel):
    item: str
    quantity: Optional[int] = 1


class ItemList(BaseModel):
    items: List[ItemEntry]


DEFAULT_USER_ID = 1


def ensure_default_user():
    """Ensure a default user exists for storing scanned ingredients."""
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM users WHERE user_id = ?", (DEFAULT_USER_ID,))
        if cur.fetchone() is None:
            cur.execute("INSERT INTO users (first_name) VALUES (?)", ("Default",))
            conn.commit()
    finally:
        conn.close()


def save_ingredients_to_db(item_names: List[str], user_id: int = DEFAULT_USER_ID) -> int:
    """Insert ingredient names into ingredients table and link to user. Returns count added."""
    conn = get_db_connection()
    added = 0
    try:
        cur = conn.cursor()
        for name in item_names:
            name = (name or "").strip()
            if not name:
                continue
            cur.execute("INSERT OR IGNORE INTO ingredients (name) VALUES (?)", (name,))
            cur.execute("SELECT ingredient_id FROM ingredients WHERE name = ?", (name,))
            row = cur.fetchone()
            if row:
                ingredient_id = row[0]
                cur.execute(
                    "INSERT OR IGNORE INTO user_ingredients (user_id, ingredient_id) VALUES (?, ?)",
                    (user_id, ingredient_id),
                )
                if cur.rowcount > 0:
                    added += 1
        conn.commit()
    finally:
        conn.close()
    return added


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    ensure_default_user()
    yield


app = FastAPI(lifespan=lifespan)

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

@app.post("/send-list/")
async def send_list(data: ItemList):
    names = [e.item for e in data.items if (e.item or "").strip()]
    if not names:
        raise HTTPException(status_code=400, detail="No items to save.")
    added = save_ingredients_to_db(names)
    return {
        "message": f"Saved {added} ingredient(s) to your inventory.",
        "count": added,
        "items": names,
    }