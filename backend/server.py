from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr
import bcrypt

# 1. SETUP
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server")

# 2. MODELS
class LoginRequest(BaseModel):
    email: str
    password: str

# 3. DATABASE CONNECTION
# Priority: Render Env Var -> Local Env Var -> Hardcoded Fallback
ATLAS_URL = "mongodb+srv://manasa0905:manasa0905@cluster0.7zhvryq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo_url = os.environ.get('MONGO_URL', ATLAS_URL)
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digital_badge_system')]

# 4. MODERN LIFESPAN
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Logic
    try:
        await client.admin.command('ping')
        logger.info("✅ SUCCESS: Connected to MongoDB Atlas!")
        
        # Ensure Admin User exists in DB
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
        existing_admin = await db.users.find_one({"email": admin_email})
        
        if not existing_admin:
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

# 5. CORS (Allowing your Vercel URL explicitly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows Vercel to communicate with Render
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. ROUTES
@app.get("/api/health")
async def health():
    return {"status": "online", "database": "connected to atlas"}

@app.post("/api/auth/login")
async def login(data: LoginRequest):
    logger.info(f"Login attempt for: {data.email}")
    
    # 1. Find user
    user = await db.users.find_one({"email": data.email})
    if not user:
        logger.warning(f"User not found: {data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # 2. Verify password
    password_match = bcrypt.checkpw(
        data.password.encode('utf-8'), 
        user['password_hash'].encode('utf-8')
    )
    
    if not password_match:
        logger.warning(f"Wrong password for: {data.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # 3. Return user data (No sensitive info)
    return {
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    }

# 7. RUN SERVER
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
