from functools import cache
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    stripe_price_id: str
    stripe_webhook_secret: str
    stripe_secret_key: str
    openai_api_key: str
    frontend_url: str
    gcs_bucket_name: str
    gcp_bucket_sa_path: str | None = None

    class Config:
        env_file = f'.env.{os.getenv("ENV", "dev")}'


@cache
def get_settings() -> Settings:
    return Settings()
