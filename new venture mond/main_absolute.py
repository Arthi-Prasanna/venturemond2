from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Get the base directory where main.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount static files
static_dir = os.path.join(BASE_DIR, "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(BASE_DIR, 'index.html'))

@app.get("/{filename}")
async def read_html(filename: str):
    # Security check: prevent directory traversal
    if ".." in filename or "/" in filename or "\\" in filename:
         return FileResponse(os.path.join(BASE_DIR, 'index.html'))

    # Construct absolute path
    file_path = os.path.join(BASE_DIR, filename)
    
    # Try with .html if original doesn't exist
    if not os.path.exists(file_path) and not filename.endswith('.html'):
        file_path += '.html'
        
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback to index.html if file not found
    print(f"File not found: {file_path}, returning index.html")
    return FileResponse(os.path.join(BASE_DIR, 'index.html'))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
