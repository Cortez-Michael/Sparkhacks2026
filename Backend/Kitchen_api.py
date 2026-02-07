import os
from requests import request
import Groq_receipt_reader
import sqlite3
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, validator
from typing import List, Union, Optional
from dotenv import load_dotenv
import json


load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

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

@app.get("/get-pantry/")
async def get_pantry():
    conn = sqlite3.connect("User_database.db")
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT name, quantity FROM pantry")
        rows = cursor.fetchall()

        pantry_list = "\n".join([f"- {row[0]} ({row[1]})" for row in rows])
        
        return {
            "pantry_text": pantry_list, 
            "items": [{"name": r[0], "quantity": r[1]} for r in rows]
        }

    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


system_message = {"role": "system", "content": "You are a helpful kitchen assistant. Use the provided database recipes when possible."}
history = []

def get_pantry_items():
    conn = sqlite3.connect("User_database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM pantry")
        return [row[0] for row in cursor.fetchall()]
    except:
        return []
    finally:
        conn.close()


def find_matching_recipes(pantry_items, limit=3):
    if not pantry_items:
        return []

    conn = sqlite3.connect("5k-recipes.db")
    cursor = conn.cursor()
    
    found_recipes = []
    
    try:
        search_terms = pantry_items[:5] 
        query_parts = [f"Ingredients LIKE ?" for _ in search_terms]
        query_string = f"SELECT Title, Ingredients, Instructions FROM recipes WHERE {' OR '.join(query_parts)} LIMIT {limit}"
        
        params = [f"%{item}%" for item in search_terms]
        
        cursor.execute(query_string, params)
        rows = cursor.fetchall()
        
        for row in rows:
            found_recipes.append({
                "title": row[0],
                "ingredients": row[1],
                "instructions": row[2]
            })
            
    except Exception as e:
        print(f"Recipe DB Error: {e}")
    finally:
        conn.close()
        
    return found_recipes

@app.post("/generate-response/")
async def generate_response(request: Request):
    data = await request.json()
    user_input = data.get("message") or data.get("prompt")
    
    if not user_input:
        return {"error": "No message provided"}

    pantry_list = get_pantry_items()
    pantry_str = ", ".join(pantry_list)
    
    db_recipes = find_matching_recipes(pantry_list)
    
    recipe_context = ""
    if db_recipes:
        recipe_context = "I found these specific recipes in the user's local database. You can recommend them:\n"
        for r in db_recipes:
            recipe_context += f"--- RECIPE: {r['title']} ---\nIngredients: {r['ingredients']}\nInstructions: {r['instructions'][:500]}...\n\n"

    full_prompt = f"""
    User Question: {user_input}
    
    USER'S PANTRY: {pantry_str}
    
    {recipe_context}
    
    Task: Answer the user. If their pantry ingredients match the database recipes, suggest those first.
    """

    history.append({"role": "user", "content": full_prompt})
    recent_history = history[-6:] 

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-maverick-17b-128e-instruct",
            messages=[system_message] + recent_history,
            temperature=0.7,
            max_tokens=1024
        )
        response_text = completion.choices[0].message.content
        
        history.append({"role": "assistant", "content": response_text})
        return {"response": response_text}

    except Exception as e:
        return {"error": str(e)}