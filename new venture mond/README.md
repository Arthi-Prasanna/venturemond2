# Venturemond

Premium Client & Admin Dashboard with Next.js Frontend and Python FastAPI Backend.

## Prerequisites

- Python 3.8+
- Node.js 18+

## Setup

1.  **Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2.  **Frontend**:
    ```bash
    npm install
    ```

## Running the Application

1.  **Start Backend** (Terminal 1):
    ```bash
    py backend/main.py
    # Runs on http://localhost:8000
    ```

2.  **Start Frontend** (Terminal 2):
    ```bash
    npm run dev
    # Runs on http://localhost:3000
    ```

## Features

- **Admin Dashboard**:
    -   Real-time stats (simulated).
    -   Client management.
    -   Analytics view.
-   **Client Dashboard**:
    -   Project timeline.
    -   Document processing.
    -   Invoice payment (Mock).
-   **Authentication**:
    -   Admin: `admin` / `admin123`
    -   Client: `client` / `client123`

## Tech Stack

-   **Frontend**: Next.js, React, Phosphor Icons, CSS Modules.
-   **Backend**: Python, FastAPI, Uvicorn.

