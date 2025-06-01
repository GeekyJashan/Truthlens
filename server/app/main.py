from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
import uvicorn

app = FastAPI(
    title="TruthLens API",
    description="API for claim detection and extraction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For local development
        "https://truthlens-j6ky.onrender.com",
        "http://truthlens-j6ky.onrender.com",
        "http://truthlens-wj2w.vercel.app",
        "https://truthlens-wj2w.vercel.app",
        # Add your production frontend URL here, e.g., "https://your-frontend-app.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,reload=True)