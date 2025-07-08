from openai import AsyncOpenAI

from app.models.models import AnkiCard, AnkiCardList, DeckModel, DeckRequest
from config import get_settings


class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=get_settings().openai_api_key)

    async def get_words_from_openai(self, level: str, number_of_words: int,
                                    native_language: str, foreign_language: str, topic: str | None = None,
                                    ) -> DeckModel:

        settings = get_settings()

        aclient = AsyncOpenAI(api_key=settings.openai_api_key)
        try:
            response = await aclient.responses.parse(model="gpt-4o-mini", text_format=DeckModel, input=[
                                                                {
                                                                    "role": "system",
                                                                    "content": f"""You are a flashcard creator. You need to create flashcards for a user. The native language of the user is {native_language} and he wants to learn {foreign_language}. His current level of {foreign_language} is {level}, so don't give him easier words than this level. You need to create {number_of_words} flashcards.

                                                                    {"The topic is " + topic if topic else ""}

                                                                    Topic is just a hint and it's very broad. Flashcards can be related to the topic very loosely.


                                                                    If the word in native language is not commonly used, give in brackets some synonyms)

                                                                    The most important rule: Don't repeat the same words unless they convey the different meaning that you gave before.

                                                                    Example if the foreign language is english and the native language is polish:
                                                                    word_in_my_foreign_language: "dog"
                                                                    description_in_my_foreign_language: "a man's best friend"
                                                                    translation_in_my_native_language: "pies"
                                                                    example_sentence_in_my_foreign_language: "The dog is barking."
                                                                    """},

                                                            ],
                                                            temperature=0.7, )
            res = response.output_parsed
            return res
        except Exception as e:
            raise Exception(f"Error analyzing tweets: {str(e)}")

    async def get_cards_from_words(self, words: list[str], request: DeckRequest) -> AnkiCardList:
        settings = get_settings()

        aclient = AsyncOpenAI(api_key=settings.openai_api_key)
        try:
            response = await aclient.responses.parse(model="gpt-4o-mini", text_format=AnkiCardList, input=[
                                                                {
                                                                    "role": "system",
                                                                    "content": f"""You are a flashcard creator. You need to create flashcards for a user. The native language of the user is {request.native_language} and he wants to learn {request.foreign_language}. His current level of {request.foreign_language} is {request.level}. You need to create {request.number_of_words} flashcards out of these words as words_in_my_foreign_language: {words}.

                                                                    IMPORTANT: Don't use other words. Use all words that are given to you in the list.
                                                                    IMPORTANT: Use all words that are given to you in the list. The number of words in the list is {len(words)}.

                                                                    Example if the foreign language is english and the native language is polish:
                                                                    word_in_my_foreign_language: "dog"
                                                                    description_in_my_foreign_language: "a man's best friend"
                                                                    translation_in_my_native_language: "pies"
                                                                    example_sentence_in_my_foreign_language: "The dog is barking."
                                                                    example_sentence_translation_in_my_native_language: "Pies szczeka."
                                                                    """},

                                                            ],
                                                            temperature=0.7, )
            return response.output_parsed
        except Exception as e:
            raise Exception(f"Error creating openai cards: {str(e)}")
