from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.modules.auth import routes as auth_routes
from app.database import engine, Base
import logging

<<<<<<< HEAD
# Import models to register them with Base
from app.modules.refunds.models import Refund
from app.modules.activity_logs.models import ActivityLog
from app.modules.exchanges.models import Exchange

=======
>>>>>>> 1e65977e (connnect)
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
<<<<<<< HEAD
        
        # Start background task to check expired offers
        import asyncio
        from app.modules.products.background_tasks import check_expired_offers
        asyncio.create_task(check_expired_offers())
        logger.info("Started background task for offer expiration")
        
=======
>>>>>>> 1e65977e (connnect)
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        logger.warning("Application started but database is not available. Please ensure MySQL is running.")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=[
        "http://localhost:3000",   # React
        "http://localhost:5173",   # Vite (just in case)
    ],
=======
    allow_origins=settings.CORS_ORIGINS,
>>>>>>> 1e65977e (connnect)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.modules.products import routes as product_routes
<<<<<<< HEAD
from app.modules.orders import routes as order_routes

# Include Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_PREFIX)

from app.modules.users import routes as user_routes
app.include_router(user_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(user_routes.employees_router, prefix=settings.API_V1_PREFIX)

app.include_router(product_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(order_routes.router, prefix=settings.API_V1_PREFIX)

from app.modules.delivery import routes as delivery_routes
app.include_router(delivery_routes.router, prefix=settings.API_V1_PREFIX)

from app.modules.refunds import routes as refund_routes
from app.modules.refunds import webhooks as refund_webhooks
app.include_router(refund_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(refund_webhooks.router, prefix=settings.API_V1_PREFIX)  # Webhook endpoints

from app.modules.activity_logs import routes as activity_log_routes
app.include_router(activity_log_routes.router, prefix=settings.API_V1_PREFIX)

from app.modules.exchanges import routes as exchange_routes
from app.modules.exchanges import webhooks as exchange_webhooks
app.include_router(exchange_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(exchange_webhooks.router, prefix=settings.API_V1_PREFIX)

from fastapi.staticfiles import StaticFiles
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
=======

# Include Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(auth_routes.employees_router, prefix=settings.API_V1_PREFIX)
app.include_router(product_routes.router, prefix=settings.API_V1_PREFIX)
>>>>>>> 1e65977e (connnect)

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
