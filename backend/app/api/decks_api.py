

from app.services.firestore_service import firestore_service
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from fastapi import APIRouter, Depends, HTTPException, Header, Request

from app.services.gcs_service import GCSService
from config import get_settings


async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid auth header")
    token = auth_header.split(" ")[1]

    try:
        settings = get_settings()
        # Verify that Google actually issued this token and that it’s meant for you
        id_info = id_token.verify_oauth2_token(token, GoogleRequest(), settings.auth_google_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google ID token")

    # At this point, id_info["sub"] is the unique Google user ID,
    # id_info["email"] is the user’s email, etc.
    return {
        "google_sub": id_info["sub"],
        "email": id_info.get("email"),
        "name": id_info.get("name"),
    }

decks_router = APIRouter()


@decks_router.get("/get-user-decks")
async def get_user_decks(current_user: dict = Depends(get_current_user)):
    # Extract the token from the Bearer header
    decks = firestore_service.get_decks_by_user(current_user["email"])
    print(decks)
    return decks


@decks_router.get("/download-deck/{deck_id}")
async def download_deck(deck_id: str, current_user: dict = Depends(get_current_user)):
    deck = firestore_service.get_deck_by_id(deck_id, current_user["email"])
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return GCSService().get_deck_by_id(deck.name_in_storage)
