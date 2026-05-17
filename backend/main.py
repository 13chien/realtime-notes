from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal, engine
import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


class CreateNoteRequest(BaseModel):
    title: str = "Untitled Note"
    content: str = ""


class UpdateNoteRequest(BaseModel):
    title: str
    content: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def serialize_note(note: models.Note):
    return {
        "id": note.id,
        "workspace_id": note.workspace_id,
        "title": note.title,
        "content": note.content,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


app.add_middleware(
    CORSMiddleware,allow_origins=[
    "http://localhost:3000",
        "https://realtime-notes-eta.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.get("/workspaces/{workspace_id}/notes")
def get_notes(workspace_id: str, db: Session = Depends(get_db)):
    notes = (
        db.query(models.Note)
        .filter(models.Note.workspace_id == workspace_id)
        .order_by(models.Note.updated_at.desc())
        .all()
    )

    return {"data": [serialize_note(note) for note in notes]}


@app.post("/workspaces/{workspace_id}/notes", status_code=201)
def create_note(
    workspace_id: str,
    request: CreateNoteRequest,
    db: Session = Depends(get_db),
):
    new_note = models.Note(
        workspace_id=workspace_id,
        title=request.title,
        content=request.content,
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {"data": serialize_note(new_note)}


@app.put("/workspaces/{workspace_id}/notes/{note_id}")
def update_note(
    workspace_id: str,
    note_id: int,
    request: UpdateNoteRequest,
    db: Session = Depends(get_db),
):
    note = (
        db.query(models.Note)
        .filter(
            models.Note.id == note_id,
            models.Note.workspace_id == workspace_id,
        )
        .first()
    )

    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    note.title = request.title
    note.content = request.content

    db.commit()
    db.refresh(note)

    return {"data": serialize_note(note)}


@app.delete("/workspaces/{workspace_id}/notes/{note_id}")
def delete_note(
    workspace_id: str,
    note_id: int,
    db: Session = Depends(get_db),
):
    note = (
        db.query(models.Note)
        .filter(
            models.Note.id == note_id,
            models.Note.workspace_id == workspace_id,
        )
        .first()
    )

    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()

    return {"message": "Note deleted"}


active_connections: dict[str, list[WebSocket]] = {}


@app.websocket("/ws/workspaces/{workspace_id}/notes/{note_id}")
async def websocket_note_endpoint(
    websocket: WebSocket,
    workspace_id: str,
    note_id: int,
):
    await websocket.accept()

    room_id = f"{workspace_id}:{note_id}"

    if room_id not in active_connections:
        active_connections[room_id] = []

    active_connections[room_id].append(websocket)

    print(f"Client connected to room {room_id}")

    try:
        while True:
            data = await websocket.receive_json()
            print("Received:", data)

            for connection in active_connections[room_id]:
                if connection != websocket:
                    await connection.send_json(data)

    except WebSocketDisconnect:
        active_connections[room_id].remove(websocket)

        print(f"Client disconnected from room {room_id}")

        if not active_connections[room_id]:
            del active_connections[room_id]