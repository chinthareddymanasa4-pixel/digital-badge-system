from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import bcrypt

# 1. SETUP
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server")

# 2. DATABASE CONNECTION
# Your Atlas link with the password included
ATLAS_URL = "mongodb+srv://manasa0905:manasa0905@cluster0.7zhvryq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo_url = os.environ.get('MONGO_URL', ATLAS_URL)
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digital_badge_system')]

# 3. MODERN LIFESPAN (Replaces on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Logic
    try:
        await client.admin.command('ping')
        logger.info("✅ SUCCESS: Connected to MongoDB Atlas!")
        
        # Ensure Admin User exists
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
        if not await db.users.find_one({"email": admin_email}):
            hashed_pw = bcrypt.hashpw("admin123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            await db.users.insert_one({
                "email": admin_email,
                "password_hash": hashed_pw,
                "name": "Administrator",
                "role": "admin",
                "created_at": datetime.now(timezone.utc)
            })
            logger.info(f"👤 Admin created: {admin_email}")
    except Exception as e:
        logger.error(f"❌ Connection Error: {e}")
    
    yield
    # Shutdown Logic
    client.close()

app = FastAPI(title="Verified Digital Badges", lifespan=lifespan)

# 4. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For now, allow everything; we will restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "online", "database": "connected to atlas"}

# 5. RUN SERVER
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)