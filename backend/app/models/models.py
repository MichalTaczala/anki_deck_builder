from datetime import datetime
from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    email: str
    level: str
    number_of_words: int
    topic: str | None = None
    native_language: str
    foreign_language: str


class DeckRequest(BaseModel):
    level: str
    number_of_words: int
    topic: str | None = None
    native_language: str
    foreign_language: str


class AnkiCard(BaseModel, frozen=True):
    word_in_my_foreign_language: str
    description_in_my_foreign_language: str
    translation_in_my_native_language: str
    example_sentence_in_my_foreign_language: str
    example_sentence_translation_in_my_native_language: str


class AnkiCardList(BaseModel, frozen=True):
    flashcards: list[AnkiCard]


class DeckModel(BaseModel, frozen=True):
    flashcards: list[AnkiCard]
    deck_name: str
    topic: str | None = None
    native_language: str
    foreign_language: str
    version: int


class DeckFirebaseModel(BaseModel, frozen=True):
    language_native: str
    language_foreign: str
    level: str
    version: int
    name_in_storage: str
    added_at: datetime
    topic: str | None = None
    version: int | None = None


class DeckFirebaseModelWithId(BaseModel, frozen=True):
    language_native: str
    language_foreign: str
    level: str
    version: int
    name_in_storage: str
    id: str | None
    added_at: datetime
    topic: str | None = None
    version: int | None = None
