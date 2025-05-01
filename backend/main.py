from fastapi import FastAPI
from backend.routes import user_routes


app = FastAPI()


# Mount the user routes using `include_router` to register the endpoints
app.include_router(user_routes.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}



# run the app: uvicorn main:app --reload