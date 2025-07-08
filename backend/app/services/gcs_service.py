from datetime import UTC, datetime, timedelta
from io import BytesIO
from fastapi.responses import StreamingResponse
from google.cloud import storage

from config import get_settings


class GCSService:
    def __init__(self):
        self.client = storage.Client.from_service_account_json(
            "anki-deck-builder-64db7723c3db.json", project="anki-deck-builder", )

    def get_deck_by_id(self, deck_id: str) -> StreamingResponse:
        bucket = self.client.bucket(get_settings().gcs_bucket_name)
        blob = bucket.blob(deck_id)
        data = blob.download_as_bytes()
        return StreamingResponse(
            BytesIO(data),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={deck_id}"}
        )

    def is_deck_in_storage(self, deck_id: str) -> bool:
        bucket = self.client.bucket(get_settings().gcs_bucket_name)
        blob = bucket.blob(deck_id)
        return blob.exists()

    def upload_deck_to_storage(self, storage_name: str, deck: BytesIO):

        bucket = self.client.bucket(get_settings().gcs_bucket_name)
        print(bucket)
        # Generate unique filename
        blob = bucket.blob(storage_name)

        # Upload the deck file
        blob.upload_from_string(deck.read(), content_type="application/octet-stream")

        blob.patch()
