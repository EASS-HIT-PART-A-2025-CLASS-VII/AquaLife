# AquaLife

Structure:
AquaLife/
├── .dockerignore
├── .env
├── .vscode/
│   ├── launch.json
│   └── settings.json
├── backend/
│   ├── config.py
│   ├── db/
│   │   ├── base.py
│   │   └── db.py
│   ├── main.py
│   ├── models/
│   │   └── user_model.py
│   ├── repositories/
│   │   └── user_repository.py
│   ├── routes/
│   │   └── user_routes.py
│   ├── security/
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   ├── hashing.py
│   │   └── oauth_google.py
│   ├── __pycache__/
│   │   └── main.cpython-312.pyc
│   │   └── main.cpython-313.pyc
├── docker-compose.yml
├── Dockerfile.backend
├── README.md
└── requirements.txt
