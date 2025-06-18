from openai import AsyncOpenAI

from app.models.models import AnkiCard, DeckModel
from config import get_settings


class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=get_settings().openai_api_key)

    async def get_words_from_openai(level: str, number_of_words: int, topic: str,
                                    native_language: str, foreign_language: str) -> list[AnkiCard]:
        """
        Analyze tweets using OpenAI's API to extract insights and patterns.
        """
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
