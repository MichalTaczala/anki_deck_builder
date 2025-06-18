# import io
# from google.oauth2 import service_account
# from datetime import datetime, timedelta, UTC
# from google.cloud import storage
# import uuid
# from fastapi import APIRouter, Request, FastAPI, HTTPException, BackgroundTasks
# import stripe
# from fastapi.responses import JSONResponse, StreamingResponse
# from fastapi import FastAPI
# from app.models.models import DeckRequest
# from config import get_settings
# from main import generate_anki_deck, get_words_from_openai
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import os
# from dotenv import load_dotenv
# import json
# from io import StringIO

# load_dotenv()

# router = APIRouter()
# # Configure CORS

# settings = get_settings()

# # Initialize Stripe


# # Store payment status and generated files (in production, use a proper database)
# payment_status = {}


# @router.get("/generate_apkg")
# async def generate_apkg(level: str, number_of_words: int, topic: str,
#                         native_language: str, foreign_language: str):
#     deck_model = await get_words_from_openai(level,
#                                              number_of_words,
#                                              topic,
#                                              native_language, foreign_language)
#     deck = generate_anki_deck(deck_model.flashcards, deck_model.deck_name)

#     return StreamingResponse(
#         deck,
#         media_type="application/octet-stream",
#         headers={"Content-Disposition": f"attachment; filename=test1.apkg"}
#     )


# def find_blob_by_session_id(bucket, session_id):
#     suffix = f"_{session_id}.apkg"

#     # Optionally use prefix filtering for performance (e.g., "requests/" if files are stored there)
#     blobs = list(bucket.list_blobs())
#     top_level_blobs = [blob for blob in blobs if '/' not in blob.name]
#     for blob in top_level_blobs:
#         if blob.name.endswith(suffix):
#             return blob  # Found the matching file

#     return None  # Not found


# @router.get("/get-deck")
# async def get_deck(session_id: str):
#     print(session_id)
#     try:
#         # Try to use service account file for local development
#         credentials = service_account.Credentials.from_service_account_file(
#             settings.gcp_bucket_sa_path
#         )
#         storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
#     except Exception:
#         # If service account file is not available, use default credentials (cloud environment)
#         storage_client = storage.Client()

#     print(settings.gcs_bucket_name)
#     bucket = storage_client.bucket(settings.gcs_bucket_name)
#     print(bucket)
#     blob = find_blob_by_session_id(bucket, session_id)
#     print(blob)

#     deck_blob = bucket.blob(blob.name)
#     if not deck_blob.exists():
#         raise HTTPException(status_code=404, detail="Deck file not found")

#     file_stream = io.BytesIO()
#     blob.download_to_file(file_stream)
#     file_stream.seek(0)

#     # Extract filename from blob.name
#     filename = blob.name.split("/")[-1]  # optional, customize if needed

#     return StreamingResponse(
#         file_stream,
#         media_type="application/octet-stream",
#         headers={"Content-Disposition": f"attachment; filename={filename}"}
#     )


# @router.get("/is-deck-created")
# async def is_deck_created(session_id: str):
#     print(session_id)
#     try:
#         # Try to use service account file for local development
#         credentials = service_account.Credentials.from_service_account_file(
#             settings.gcp_bucket_sa_path
#         )
#         storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
#     except Exception:
#         # If service account file is not available, use default credentials (cloud environment)
#         storage_client = storage.Client()

#     print(settings.gcs_bucket_name)
#     bucket = storage_client.bucket(settings.gcs_bucket_name)
#     print(bucket)
#     blob = find_blob_by_session_id(bucket, session_id)
#     if not blob:
#         return False
#     print(blob)

#     deck_blob = bucket.blob(blob.name)
#     if not deck_blob.exists():
#         return False
#     return True
