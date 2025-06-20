from io import BytesIO
from fastapi.responses import StreamingResponse
from google.cloud import storage

from app.models.models import DeckFirebaseModel
from config import get_settings


class GCSService:
    def __init__(self):
        self.client = storage.Client.from_service_account_json(
            "anki-deck-builder-64db7723c3db.json", project="anki-deck-builder", )

    def get_deck_by_id(self, deck_id: str) -> DeckFirebaseModel:
        bucket = self.client.bucket(get_settings().gcs_bucket_name)
        blob = bucket.blob(deck_id)
        data = blob.download_as_bytes()
        return StreamingResponse(
            BytesIO(data),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={deck_id}"}
        )
