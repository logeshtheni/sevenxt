from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import os

from app.config import settings
from app.database import engine, Base

# --- IMPORT ALL ROUTERS (Verified) ---
from app.modules.auth import routes as auth_routes
from app.modules.products import routes as product_routes
from app.modules.cms.routes import router as cms_router
from app.modules.campaigns.routes import router as campaigns_router
from app.modules.b2b.routes import router as b2b_router # B2B Router
from app.modules.finance.routes import router as finance_router 

# 1. LOGGING CONFIGURATION
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 2. APP INITIALIZATION
# Single initialization is mandatory to prevent 404 errors on your routes
app = FastAPI(
    title="SevenXT Admin API",
    description="Backend API for SevenXT Admin Dashboard",
    version="2.0.0"
)

# 3. DIRECTORY SETUP
# Automatically creates folders for your CMS and B2B uploads
upload_dirs = ["uploads", "uploads/banners", "uploads/categories", "uploads/campaigns"]
for folder in upload_dirs:
    os.makedirs(folder, exist_ok=True)

# 4. STATIC FILES MOUNTING
# This allows your dashboard to show the GST/PAN certificates
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 5. CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. CUSTOM MIDDLEWARE (Ensures OPTIONS requests work for B2B/Finance)
@app.middleware("http")
async def allow_preflight_requests(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    return await call_next(request)

# 7. STARTUP EVENT
@app.on_event("startup")
async def startup_event():
    try:
        # Verifies database tables (CMS, B2B, Products, etc.)
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables verified")

        # Background task for offer expiration
        import asyncio
        from app.modules.products.background_tasks import check_expired_offers
        asyncio.create_task(check_expired_offers())
        logger.info("✅ Background tasks started")

    except Exception as e:
        logger.error(f"❌ Startup error: {e}")

# -------------------------------------------------
# 8. REGISTER ALL ROUTERS (All Workflows Preserved)
# -------------------------------------------------
API_PREFIX = settings.API_V1_PREFIX 

# Auth & Employee Workflows
app.include_router(auth_routes.router, prefix=API_PREFIX)
app.include_router(auth_routes.employees_router, prefix=API_PREFIX)

# Product & Inventory Workflows
app.include_router(product_routes.router, prefix=API_PREFIX)

# CMS & Campaign Workflows
app.include_router(cms_router, prefix=API_PREFIX)
app.include_router(campaigns_router, prefix=API_PREFIX)

# B2B MANAGEMENT WORKFLOW (Updated with Auto-Verify)
app.include_router(b2b_router, prefix=API_PREFIX) 

# FINANCE & PAYMENTS WORKFLOW
app.include_router(finance_router, prefix=API_PREFIX) 

# -------------------------------------------------
# 9. SYSTEM HEALTH
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