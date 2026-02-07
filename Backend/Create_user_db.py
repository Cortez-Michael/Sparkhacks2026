import sqlite3

def get_db_connection():
    conn = sqlite3.connect("User_database.db")
    return conn

def init_db():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS pantry (
            ingredient_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            quantity TEXT NOT NULL
        );
        """)

        conn.commit()
        print("Database initialized")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_db()