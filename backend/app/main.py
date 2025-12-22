from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import os

from app.config import settings
from app.database import engine, Base

# ROUTERS
from app.modules.auth import routes as auth_routes
from app.modules.products import routes as product_routes
from app.modules.cms.routes import router as cms_router
from app.modules.campaigns.routes import router as campaigns_router
from app.modules.b2b.routes import router as b2b_router
# --- ADDED FINANCE ROUTER ---
from app.modules.finance.routes import router as finance_router 

# 2. Create the app instance FIRST (Exactly like your working code)
app = FastAPI() 

# 3. Create the folder on your computer if it doesn't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# 4. NOW you can use app.mount
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# This line tells FastAPI: "If someone asks for /uploads, look in the uploads folder"
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -------------------------------------------------
# LOGGING
# -------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------------------------------------
# APP INIT (Restored your exact double-init workflow)
# -------------------------------------------------
app = FastAPI(
    title="SevenXT Admin API",
    description="Backend API for SevenXT Admin Dashboard",
    version="2.0.0"
)

# -------------------------------------------------
# STARTUP
# -------------------------------------------------
@app.on_event("startup")
async def startup_event():
    try:
        # Verify database connection and create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created / verified successfully")

        # Background task for offer expiration
        import asyncio
        from app.modules.products.background_tasks import check_expired_offers
        asyncio.create_task(check_expired_offers())

    except Exception as e:
        logger.error(f"Startup error: {e}")

# -------------------------------------------------
# CORS (Using your original logic)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# STATIC FILES (Essential for CMS Images)
# -------------------------------------------------
os.makedirs("uploads/banners", exist_ok=True)
os.makedirs("uploads/categories", exist_ok=True)
os.makedirs("uploads/campaigns", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -------------------------------------------------
# MIDDLEWARE (Preflight Handling)
# -------------------------------------------------
@app.middleware("http")
async def allow_preflight_requests(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    return await call_next(request)

# -------------------------------------------------
# ROUTERS 
# -------------------------------------------------
API_PREFIX = settings.API_V1_PREFIX 

app.include_router(auth_routes.router, prefix=API_PREFIX)
app.include_router(auth_routes.employees_router, prefix=API_PREFIX)
app.include_router(product_routes.router, prefix=API_PREFIX)
app.include_router(cms_router, prefix=API_PREFIX)
app.include_router(campaigns_router, prefix=API_PREFIX)
app.include_router(b2b_router, prefix=API_PREFIX) 
# --- ADDED FINANCE HERE ---
app.include_router(finance_router, prefix=API_PREFIX) 

# -------------------------------------------------
# SYSTEM HEALTH
# -------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "SevenXT Admin API is running",
        "status": "healthy",
        "version": "2.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}