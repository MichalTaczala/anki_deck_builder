import io
from google.oauth2 import service_account
from datetime import datetime, timedelta, UTC
from google.cloud import storage
import uuid
from fastapi import APIRouter, Request, FastAPI, HTTPException, BackgroundTasks
import stripe
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi import FastAPI
from config import get_settings
from main import generate_anki_deck, get_words_from_openai
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import json
from io import StringIO

load_dotenv()

app = FastAPI()

# Configure CORS
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
settings = get_settings()

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key
STRIPE_WEBHOOK_SECRET = settings.stripe_webhook_secret

# Store payment status and generated files (in production, use a proper database)
payment_status = {}


class DeckRequest(BaseModel):
    level: str
    number_of_words: int
    topic: str | None = None
    native_language: str
    foreign_language: str


@app.get("/initialize")
def initialize_api():
    return {"message": "Hello World"}


@app.get("/generate_apkg")
async def generate_apkg(level: str, number_of_words: int, topic: str,
                        native_language: str, foreign_language: str):
    deck_model = await get_words_from_openai(level,
                                             number_of_words,
                                             topic,
                                             native_language, foreign_language)
    deck = generate_anki_deck(deck_model.flashcards, deck_model.deck_name)

    return StreamingResponse(
        deck,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename=test1.apkg"}
    )


async def generate_deck(request: DeckRequest, session_id: str):
    print(request)
    deck_model = await get_words_from_openai(request.level,
                                             request.number_of_words,
                                             request.topic,
                                             request.native_language,
                                             request.foreign_language)
    deck = generate_anki_deck(deck_model.flashcards, deck_model.deck_name)
    print(deck)

    # Initialize Google Cloud Storage client
    try:
        # Try to use service account file for local development
        credentials = service_account.Credentials.from_service_account_file(
            settings.gcp_bucket_sa_path
        )
        storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
    except Exception:
        # If service account file is not available, use default credentials (cloud environment)
        storage_client = storage.Client()

    bucket = storage_client.bucket(settings.gcs_bucket_name)
    print(bucket)
    # Generate unique filename
    filename = f"{deck_model.deck_name.lower().replace(' ', '_')}_{session_id}.apkg"
    blob = bucket.blob(filename)

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


class CheckoutRequest(BaseModel):
    email: str
    level: str
    number_of_words: int
    topic: str
    native_language: str
    foreign_language: str


@app.post("/create-checkout-session")
async def create_checkout_session(data: CheckoutRequest):
    data.number_of_words = 200
    try:
        session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": get_settings().stripe_price_id,
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=get_settings().frontend_url + "/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=get_settings().frontend_url + "/cancel",
            automatic_tax={"enabled": True},
            customer_email=data.email,
            metadata={
                "level": data.level,
                "number_of_words": data.number_of_words,
                "topic": data.topic,
                "native_language": data.native_language,
                "foreign_language": data.foreign_language,
            },
        )
        print(f"✅ Session created successfully: {session.id}")
        print(f"🔗 Checkout URL: {session.url}")

        return {"url": session.url}
    except Exception as e:
        print(f"❌ Error creating session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def find_blob_by_session_id(bucket, session_id):
    suffix = f"_{session_id}.apkg"

    # Optionally use prefix filtering for performance (e.g., "requests/" if files are stored there)
    blobs = list(bucket.list_blobs())
    top_level_blobs = [blob for blob in blobs if '/' not in blob.name]
    for blob in top_level_blobs:
        if blob.name.endswith(suffix):
            return blob  # Found the matching file

    return None  # Not found


@app.get("/get-deck")
async def get_deck(session_id: str):
    print(session_id)
    try:
        # Try to use service account file for local development
        credentials = service_account.Credentials.from_service_account_file(
            settings.gcp_bucket_sa_path
        )
        storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
    except Exception:
        # If service account file is not available, use default credentials (cloud environment)
        storage_client = storage.Client()

    print(settings.gcs_bucket_name)
    bucket = storage_client.bucket(settings.gcs_bucket_name)
    print(bucket)
    blob = find_blob_by_session_id(bucket, session_id)
    print(blob)

    deck_blob = bucket.blob(blob.name)
    if not deck_blob.exists():
        raise HTTPException(status_code=404, detail="Deck file not found")

    file_stream = io.BytesIO()
    blob.download_to_file(file_stream)
    file_stream.seek(0)

    # Extract filename from blob.name
    filename = blob.name.split("/")[-1]  # optional, customize if needed

    return StreamingResponse(
        file_stream,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.get("/is-deck-created")
async def is_deck_created(session_id: str):
    print(session_id)
    try:
        # Try to use service account file for local development
        credentials = service_account.Credentials.from_service_account_file(
            settings.gcp_bucket_sa_path
        )
        storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
    except Exception:
        # If service account file is not available, use default credentials (cloud environment)
        storage_client = storage.Client()

    print(settings.gcs_bucket_name)
    bucket = storage_client.bucket(settings.gcs_bucket_name)
    print(bucket)
    blob = find_blob_by_session_id(bucket, session_id)
    if not blob:
        return False
    print(blob)

    deck_blob = bucket.blob(blob.name)
    if not deck_blob.exists():
        return False
    return True


@app.post("/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        session_id = session["id"]

        # Create a DeckRequest object from the session metadata
        # session["metadata"] = {
        #     "level": "A1",
        #     "number_of_words": 10,
        #     "topic": "Animals",
        #     "native_language": "English",
        #     "foreign_language": "Spanish"
        # }
        deck_request = DeckRequest(
            level=session["metadata"]["level"],
            number_of_words=int(session["metadata"]["number_of_words"]),
            topic=session["metadata"]["topic"],
            native_language=session["metadata"]["native_language"],
            foreign_language=session["metadata"]["foreign_language"]
        )

        # Store the request data in GCS
        storage_client = storage.Client()
        bucket = storage_client.bucket(settings.gcs_bucket_name)

        # Create a metadata file
        metadata_blob = bucket.blob(f"requests/{session_id}.json")
        metadata = {
            "session_id": session_id,
            "customer_email": session["customer_email"],
            "deck_request": deck_request.model_dump(),
            "created_at": datetime.now(UTC).isoformat(),
            "status": "pending"
        }
        metadata_blob.upload_from_string(
            json.dumps(metadata),
            content_type="application/json"
        )

        # Trigger deck generation in background
        background_tasks.add_task(generate_deck, deck_request, session_id)
        payment_status[session_id] = "processing"

        return {"status": "success"}
    return {"status": "error"}
