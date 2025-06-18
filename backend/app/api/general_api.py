from fastapi import APIRouter

general_router = APIRouter()


@general_router.get("/initialize")
def initialize_api():
    return {"message": "Hello World"}
