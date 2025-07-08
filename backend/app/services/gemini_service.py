from app.models.models import AnkiCard, DeckModel, DeckRequest
from config import get_settings

from google import genai


class GeminiService:
    def __init__(self):
        self.client = genai.Client(vertexai=True, project=get_settings().google_project_id, location="global")

    async def generate_words(self, request: DeckRequest, previous_words: list[str]):
        prompt = f"""
        Generate 100 unique vocabulary words for language learning.

        Requirements:
        - Level of words: {request.level}
        - Foreign language: {request.foreign_language}
        - Topic: {request.topic if request.topic else "general"}

        IMPORTANT: Do not include any of these previously used words as your word_in_my_foreign_language: {', '.join(previous_words)}
        """

        try:
            response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": list[str]
                }
            )
            words_data: list[str] = response.parsed

            return words_data

        except Exception as e:
            print(f"Error generating words with Gemini: {str(e)}")
            raise e
