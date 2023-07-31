# Bookworm - Light Novel and Manga Reader

## Installation

### Clone the project

```bash
  git clone https://github.com/Farris-Abuhadba/bookworm.git
```

### Setup Backend

```bash
  cd backend  # Go to backend

  python -m venv name_of_your_venv  # Create Virtual Environment
  .\name_of_your_venv\Scripts\activate.bat  # Activate Venv
  pip install -r requirements.txt  # Install dependencies

  uvicorn main:app --reload  # Start backend
```

### Setup Frontend

```bash
  cd frontend  # Go to frontend

  npm install  # Install dependencies
  npm run dev  # Start frontend
```
