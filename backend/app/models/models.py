from datetime import datetime
from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    email: str
    level: str
    number_of_words: int
    topic: str
    native_language: str
    foreign_language: str


class DeckRequest(BaseModel):
    level: str
    number_of_words: int
    topic: str | None = None
    native_language: str
    foreign_language: str


class AnkiCard(BaseModel):
    word_in_my_foreign_language: str
    description_in_my_foreign_language: str
    translation_in_my_native_language: str
    example_sentence_in_my_foreign_language: str


class DeckModel(BaseModel):
    flashcards: list[AnkiCard]
    deck_name: str


class DeckFirebaseModel(BaseModel):
    name: str
    language_native: str
    language_foreign: str
    level: str
    version: int
    name_in_storage: str
    added_at: datetime
