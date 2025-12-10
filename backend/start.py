"""
Startup script for the backend server
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,  # Changed to 8001 to avoid port conflict
        reload=False  # Disabled auto-reload for debugging
    )

