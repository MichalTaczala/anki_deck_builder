from datetime import UTC, datetime
import json
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
import stripe
from google.cloud import storage
import uuid
from app.models.models import CheckoutRequest, DeckFirebaseModel, DeckRequest
from app.services.decks_service import generate_deck
from app.services.firestore_service import FirestoreService
from config import get_settings

stripe_router = APIRouter()
settings = get_settings()
stripe.api_key = settings.stripe_secret_key
STRIPE_WEBHOOK_SECRET = settings.stripe_webhook_secret


@stripe_router.post("/create-checkout-session")
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
                "number_of_words": str(data.number_of_words),
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


@stripe_router.post("/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        session_id = session["id"]

        deck_request = DeckRequest(
            level=session["metadata"]["level"],
            number_of_words=int(session["metadata"]["number_of_words"]),
            topic=session["metadata"]["topic"],
            native_language=session["metadata"]["native_language"],
            foreign_language=session["metadata"]["foreign_language"]
        )
        firestore_service = FirestoreService()
        iterator = 1
        storage_name = f"{
            deck_request.native_language}_{
            deck_request.foreign_language}_{
            deck_request.level}_{deck_request.topic if deck_request.topic else "general"}_{iterator}.apkg"
        background_tasks.add_task(
            firestore_service.add_deck,
            session["customer_email"],
            DeckFirebaseModel(
                added_at=datetime.now(UTC),
                name=session["customer_email"],
                language_native=deck_request.native_language,
                language_foreign=deck_request.foreign_language,
                level=deck_request.level,
                topic=deck_request.topic,
                version=iterator,
                name_in_storage=storage_name,
            )
        )
        background_tasks.add_task(generate_deck, deck_request, storage_name)
        return {"status": "success"}
    return {"status": "error"}
