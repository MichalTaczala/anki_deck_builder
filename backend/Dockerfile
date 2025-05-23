FROM python:3.13-alpine




COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app


# Copy project files
COPY pyproject.toml uv.lock ./

# Install project dependencies
RUN uv sync --frozen --no-cache

# Copy application code
COPY . .
# Install dependencies


ENV PORT=8080
ENV ENV=prod

EXPOSE ${PORT}

# Run the application.
CMD ["sh", "-c", "uv run uvicorn api:app --host 0.0.0.0 --port ${PORT}"]


