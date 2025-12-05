from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.modules.auth import routes as auth_routes
from app.database import engine, Base
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SevenXT Admin API",
    description="Backend API for SevenXT Admin Dashboard",
    version="2.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        # Create database tables (only if they don't exist)
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        logger.warning("Application started but database is not available. Please ensure MySQL is running.")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.modules.products import routes as product_routes

# Include Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(auth_routes.employees_router, prefix=settings.API_V1_PREFIX)
app.include_router(product_routes.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "message": "SevenXT Admin API is running",
        "version": "2.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
