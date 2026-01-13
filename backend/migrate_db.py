"""
Database migration script to add new auth columns.
Run this script to update the database schema.

Usage: python migrate_db.py
"""

from app.database import engine
from sqlalchemy import text

def migrate():
    print("Starting database migration...")

    with engine.connect() as conn:
        statements = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR DEFAULT NULL",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR DEFAULT NULL",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP DEFAULT NULL",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR DEFAULT NULL",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP DEFAULT NULL",
        ]

        for stmt in statements:
            try:
                conn.execute(text(stmt))
                print(f"  OK: Added column from: {stmt.split('ADD COLUMN IF NOT EXISTS ')[1].split(' ')[0]}")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                    print(f"  SKIP: Column already exists")
                else:
                    print(f"  ERROR: {e}")

        conn.commit()
        print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
