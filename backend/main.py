from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import user_routes


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1",
        "http://127.0.0.1:3000"
    ],  
    # Allow both localhost and localhost:3000
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Mount the user routes using `include_router` to register the endpoints
app.include_router(user_routes.router, prefix="/api")



@app.get("/")
def read_root():
    return {"Hello": "World"}



# run the app: uvicorn main:app --reload