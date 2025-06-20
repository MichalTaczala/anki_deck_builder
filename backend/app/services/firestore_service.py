from google.cloud import firestore

# File: firestore_service.py

from typing import Any, Optional
from google.cloud import firestore

from app.models.models import DeckFirebaseModel


class FirestoreService:
    def __init__(self) -> None:
        self.db = firestore.Client.from_service_account_json(
            "anki-deck-builder-e2f3cfaba79d.json",
            project="anki-deck-builder",
            database="anki-decks"
        )

    def get_decks_by_user(self, email: str) -> list[DeckFirebaseModel]:
        decks = self.db.collection("users").document(email).collection("decks")
        decks_list = []
        for deck in decks.stream():
            deck_dict = deck.to_dict()
            deck_dict["id"] = deck.id
            decks_list.append(DeckFirebaseModel(**deck_dict))
        return decks_list

    def add_deck(
        self,
        email: str,
        deck: DeckFirebaseModel
    ) -> None:
        decks2 = self.db.collection("users").document(email).collection("decks")
        decks2.add(deck.model_dump())

    def get_deck_by_id(self, deck_id: str, email: str) -> DeckFirebaseModel:
        deck = self.db.collection("users").document(email).collection("decks").document(deck_id).get()
        if not deck:
            return None
        return DeckFirebaseModel(**deck.to_dict())


firestore_service = FirestoreService()
