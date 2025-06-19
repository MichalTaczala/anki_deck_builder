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

    def get_decks_by_user(self, email: str) -> list[dict[str, Any]]:
        collections = self.db.collections()
        for collection in collections:
            print(f"Collection: {collection.id}")
            # Get all documents in the collection
            docs = collection.get()
            for doc in docs:
                print(f"  Document: {doc.id}")
                print(f"  Data: {doc.to_dict()}")

        decks = self.db.collection("users").where("email", "==", email).collection("decks").get()
        return decks

    def add_deck(
        self,
        email: str,
        deck: DeckFirebaseModel
    ) -> None:
        users = self.db.collection("users").get()
        user = self.db.collection("users").where("email", "==", email).get()
        decks2 = self.db.collection("users").document(email).collection("decks")
        d = decks2.get()
        decks2.add(deck.model_dump())


firestore_service = FirestoreService()
