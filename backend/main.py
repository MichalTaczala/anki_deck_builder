import asyncio
from io import BytesIO
import genanki
import random
from pydantic import BaseModel, Field
from config import get_settings
from openai import AsyncOpenAI


class WORD(BaseModel):
    word_in_my_foreign_language: str
    description_in_my_foreign_language: str
    translation_in_my_native_language: str
    example_sentence_in_my_foreign_language: str


class DeckModel(BaseModel):
    flashcards: list[WORD]
    deck_name: str


async def get_words_from_openai(level: str, number_of_words: int, topic: str,
                                native_language: str, foreign_language: str) -> list[WORD]:
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


def generate_anki_deck(words: list[WORD], deck_name: str) -> None:
    # Generate unique model and deck IDs
    model_id = random.randrange(1 << 30, 1 << 31)
    deck_id = random.randrange(1 << 30, 1 << 31)

    # Define a custom model with four fields
    model = genanki.Model(
        model_id,
        'Foreign Word Extended Model',
        fields=[
            {'name': 'word_foreign'},
            {'name': 'description_foreign'},
            {'name': 'translation_native'},
            {'name': 'example_sentence_foreign'},
        ],
        templates=[
            {
                'name': 'Foreign to Native',
                'qfmt': '{{word_foreign}}<br>{{hint:description_foreign}}<br>{{hint:example_sentence_foreign}}<br>',
                'afmt': '{{FrontSide}}<hr id=answer>{{translation_native}}',
            },
            {
                'name': 'Native to Foreign',
                'qfmt': '{{translation_native}}<br>{{hint:description_foreign}}',
                'afmt': '{{FrontSide}}<hr id=answer>{{word_foreign}}',
            },
        ],
        css="""
        .card {
            font-family: arial;
            font-size: 20px;
            text-align: center;
            color: black;
            background-color: white;
        }
        """
    )

    # Create a deck
    deck = genanki.Deck(
        deck_id,
        deck_name
    )

    # Add cards
    for word in words:
        note = genanki.Note(
            model=model,
            fields=[
                word.word_in_my_foreign_language,
                word.description_in_my_foreign_language,
                word.translation_in_my_native_language,
                word.example_sentence_in_my_foreign_language
            ]
        )
        deck.add_note(note)

    # Generate the Anki package
    output_filename = f"{deck_name.lower().replace(' ', '_')}.apkg"
    output = BytesIO()
    genanki.Package(deck).write_to_file(output)
    output.seek(0)

    return output


async def main():
    deck_model = await get_words_from_openai("C2", 10, "", native_language="Polish", foreign_language="English")
    deck = generate_anki_deck(deck_model.flashcards, deck_model.deck_name)


# Example usage
if __name__ == "__main__":
    asyncio.run(main())
