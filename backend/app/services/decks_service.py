from datetime import UTC, datetime, timedelta
from app.models.models import DeckRequest
from app.services.anki_service import AnkiService
from app.services.open_ai_service import OpenAIService
from google.cloud import storage

from config import get_settings


async def generate_deck(request: DeckRequest, storage_name: str):
    print(request)
    deck_model = await OpenAIService().get_words_from_openai(request.level,
                                                             request.number_of_words,
                                                             topic=request.topic,
                                                             native_language=request.native_language,
                                                             foreign_language=request.foreign_language)
    deck = AnkiService().generate_anki_deck(deck_model)
    print(deck)

    # Initialize Google Cloud Storage client
    try:
        # Try to use service account file for local development

        storage_client = storage.Client.from_service_account_json(
            "anki-deck-builder-64db7723c3db.json", project="anki-deck-builder", )
    except Exception:
        # If service account file is not available, use default credentials (cloud environment)
        storage_client = storage.Client()

    bucket = storage_client.bucket(get_settings().gcs_bucket_name)
    print(bucket)
    # Generate unique filename
    blob = bucket.blob(storage_name)

    # Upload the deck file
    blob.upload_from_string(deck.read(), content_type="application/octet-stream")

    # Set expiration time to 1 week from now
    expiration_time = datetime.now(UTC) + timedelta(days=14)
    blob.metadata = {"expiration_time": expiration_time.isoformat()}
    blob.patch()

    # Return the download URL
    return {"download_url": blob.generate_signed_url(
            version="v4",
            expiration=timedelta(days=5),
            method="GET"
            )}
