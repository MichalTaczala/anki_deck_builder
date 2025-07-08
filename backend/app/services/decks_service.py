from datetime import UTC, datetime
from app.models.models import DeckFirebaseModel, DeckModel, DeckRequest
from app.services.anki_service import AnkiService
from app.services.firestore_service import FirestoreService
from app.services.gcs_service import GCSService
from app.services.gemini_service import GeminiService
from app.services.open_ai_service import OpenAIService


async def generate_words_and_deck(request: DeckRequest, storage_name: str, version: int):
    gcs_service = GCSService()

    if gcs_service.is_deck_in_storage(storage_name):
        return
    deck: DeckModel = await generate_words(request, version)

    firestore_service = FirestoreService()
    deck_firebase_model = DeckFirebaseModel(
        language_native=request.native_language,
        language_foreign=request.foreign_language,
        level=request.level,
        version=version,
        name_in_storage=storage_name,
        topic=request.topic,
        added_at=datetime.now(UTC),

    )
    firestore_service.add_deck(deck_firebase_model, deck.flashcards)

    deck_file = AnkiService().generate_anki_deck(deck)
    print(deck_file)

    gcs_service.upload_deck_to_storage(storage_name, deck_file)


async def generate_words(request: DeckRequest, version: int) -> DeckModel:
    current_words = FirestoreService().get_words(
        request.level,
        request.topic,
        request.native_language,
        request.foreign_language)
    gemini_service = GeminiService()
    words_unique = set()
    while len(words_unique) < 100:
        words = await gemini_service.generate_words(request, current_words)
        words_unique.update(list(set(words) - set(current_words)))

    openai_service = OpenAIService()
    final_cards = set()
    deck = None
    while len(final_cards) < 100:
        anki_card_list = await openai_service.get_cards_from_words(list(words_unique), request)
        final_cards.update(anki_card_list.flashcards)
    deck = DeckModel(flashcards=list(final_cards), deck_name=request.topic,
                     native_language=request.native_language, foreign_language=request.foreign_language, version=version)
    return deck
