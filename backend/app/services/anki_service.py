from io import BytesIO
import random
from app.models.models import AnkiCard, DeckModel
import genanki


class AnkiService:
    def __init__(self):
        pass

    def generate_anki_deck(self, deck_model: DeckModel) -> BytesIO:
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
            deck_model.deck_name
        )

        # Add cards
        for word in deck_model.flashcards:
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
        output = BytesIO()
        genanki.Package(deck).write_to_file(output)
        output.seek(0)

        return output
