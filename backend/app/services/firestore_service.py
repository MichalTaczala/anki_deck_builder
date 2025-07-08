from google.cloud import firestore

# File: firestore_service.py

from typing import Any, Optional
from google.cloud import firestore

from app.models.models import AnkiCard, DeckFirebaseModel, DeckFirebaseModelWithId, DeckRequest


class FirestoreService:
    def __init__(self) -> None:
        self.db = firestore.Client.from_service_account_json(
            "anki-deck-builder-e2f3cfaba79d.json",
            project="anki-deck-builder",
            database="anki-decks"
        )

    def get_decks_by_user(self, email: str) -> list[DeckFirebaseModelWithId]:
        decks = self.db.collection("users").document(email).collection("decks")
        decks_list = []
        for deck in decks.stream():
            deck_dict = deck.to_dict()
            deck_dict["id"] = deck.id
            decks_list.append(DeckFirebaseModelWithId(**deck_dict))
        return decks_list

    def add_deck_to_user(
        self,
        email: str,
        deck: DeckFirebaseModel
    ) -> None:
        decks2 = self.db.collection("users").document(email).collection("decks")
        decks2.add(deck.model_dump())

    def get_deck_by_id(self, deck_id: str, email: str) -> DeckFirebaseModelWithId:
        deck = self.db.collection("users").document(email).collection("decks").document(deck_id).get()
        if not deck:
            return None
        dic = deck.to_dict()
        dic["id"] = deck.id
        return DeckFirebaseModelWithId(**dic)

    def get_current_number_of_user_decks_of_the_same_type(self, email: str, deck_request: DeckRequest) -> int:
        decks = self.db.collection("users").document(email).collection("decks")
        decks_list = []
        for deck in decks.stream():
            deck_dict = deck.to_dict()
            deck_dict["id"] = deck.id
            decks_list.append(DeckFirebaseModelWithId(**deck_dict))
        current_number_of_decks_of_the_same_type = 0
        for deck in decks_list:
            if deck.level == deck_request.level and deck.topic == deck_request.topic and deck.language_native == deck_request.native_language and deck.language_foreign == deck_request.foreign_language:
                current_number_of_decks_of_the_same_type += 1
        return current_number_of_decks_of_the_same_type

    def add_deck(self, deck: DeckFirebaseModel, cards: list[AnkiCard]):
        self.db.collection("decks").document(deck.language_native) \
            .collection(deck.language_foreign).document(deck.level) \
            .collection(deck.topic).document(str(deck.version)) \
            .set({"flashcards": [card.model_dump() for card in cards]})

    def get_words(self, level: str, topic: str,
                  native_language: str, foreign_language: str) -> list[str]:
        decks = self.db.collection("decks").document(native_language) \
            .collection(foreign_language).document(level) \
            .collection(topic).stream()
        words = []
        for anki_card in decks:
            for card in anki_card.to_dict()["flashcards"]:
                words.append(card["word_in_my_foreign_language"])
        return words


firestore_service = FirestoreService()
