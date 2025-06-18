import asyncio
from io import BytesIO

from fastapi import FastAPI

from config import get_settings

from app.services.anki_service import AnkiService
from app.services.open_ai_service import OpenAIService
from fastapi.middleware.cors import CORSMiddleware
from app.api.general_api import general_router
from app.api.stripe_api import stripe_router
from app.api.decks_api import decks_router
app = FastAPI()
app.include_router(general_router)
app.include_router(stripe_router)
app.include_router(decks_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://frontend-427156224408.europe-west1.run.app",
        "https://memohill.com"],
    # Frontend URL

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example usage
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
