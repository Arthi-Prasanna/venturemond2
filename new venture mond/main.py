from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    role: Optional[str] = None
    redirect: Optional[str] = None
    message: Optional[str] = None

class AdminStats(BaseModel):
    clients: int
    revenue: float
    pending: int
    revenueTrend: List[int]

class Client(BaseModel):
    name: str
    project: str
    status: str
    budget: str
    avatar: str

class ClientDashboardData(BaseModel):
    projectName: str
    clientName: str
    progress: int
    balance: float
    documents: List[dict]
    timeline: List[dict]

# --- Endpoints ---

@app.post("/api/login", response_model=LoginResponse)
def login(creds: LoginRequest):
    if creds.username == "admin" and creds.password == "admin123":
        return {"success": True, "role": "admin", "redirect": "/admin"}
    elif creds.username == "client" and creds.password == "client123":
        return {"success": True, "role": "client", "redirect": "/client"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/admin/stats", response_model=AdminStats)
def get_admin_stats():
    return {
        "clients": 142,
        "revenue": 45.2,
        "pending": 18,
        "revenueTrend": [random.randint(40, 100) for _ in range(7)]
    }

@app.get("/api/admin/clients", response_model=List[Client])
def get_recent_clients():
    return [
        { "name": "Stark Industries", "project": "Arc Reactor UI", "status": "Active", "budget": "$500k", "avatar": "S" },
        { "name": "Wayne Enterprises", "project": "Batcave Security", "status": "Pending", "budget": "$850k", "avatar": "W" },
        { "name": "Cyberdyne", "project": "Skynet Protocol", "status": "Delayed", "budget": "$1.2M", "avatar": "C" },
        { "name": "Umbrella Corp", "project": "Viral Marketing", "status": "Active", "budget": "$200k", "avatar": "U" },
        { "name": "Massive Dynamic", "project": "Pattern Recognition", "status": "Active", "budget": "$650k", "avatar": "M" },
    ]

@app.get("/api/client/dashboard", response_model=ClientDashboardData)
def get_client_dashboard():
    return {
        "projectName": "Quantum Website Redesign",
        "clientName": "Alex Morgan",
        "progress": 85,
        "balance": 2450.00,
        "documents": [
            { "name": "Project_Proposal_v2.pdf", "size": "2.4 MB", "date": "2 days ago", "type": "pdf" },
            { "name": "Homepage_Mockup_v1.png", "size": "5.1 MB", "date": "5 days ago", "type": "image" }
        ],
        "timeline": [
            { "status": "completed", "title": "Discovery", "date": "Sep 15" },
            { "status": "completed", "title": "Wireframing", "date": "Sep 30" },
            { "status": "active", "title": "UI Design", "date": "In Progress" },
            { "status": "pending", "title": "Development", "date": "Nov 1" },
            { "status": "pending", "title": "Launch", "date": "TBD" }
        ]
    }

# --- Static Files ---
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Mount static directory
current_dir = os.path.dirname(os.path.realpath(__file__))
static_dir = os.path.join(current_dir, "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/{filename}.html")
async def read_html(filename: str):
    file_path = os.path.join(static_dir, f"{filename}.html")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/style.css")
async def read_css():
    return FileResponse(os.path.join(static_dir, "style.css"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
