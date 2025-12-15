from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Pointing to the scratch/venturemond directory
base_dir = r"C:\Users\jarth\.gemini\antigravity\scratch\venturemond"
if not os.path.exists(base_dir):
    os.makedirs(base_dir)

# Mount the static directory to root "/"
# html=True allows serving index.html automatically at "/"
app.mount("/", StaticFiles(directory=base_dir, html=True), name="site")

if __name__ == "__main__":
    import uvicorn
    # process.env.PORT or 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
