"use client";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import NoteEditor from "@/components/NoteEditor";
import { useEffect, useState } from "react";
import {
  Note,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/lib/api/notes";

export default function WorkspacePage() {
  const params = useParams();

  const workspaceId = params.workspaceId as string;

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);

        const notes = await getNotes(workspaceId);

        setNotes(notes);
        setSelectedNoteId(notes[0]?.id ?? null);
      } catch {
        setError("Failed to load notes. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [workspaceId]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    if (!selectedNoteId) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000"}/ws/workspaces/${workspaceId}/notes/${selectedNoteId}`
    );

    ws.onmessage = (event) => {
      const updatedNote = JSON.parse(event.data) as Note;

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    };

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [selectedNoteId, workspaceId]);

  useEffect(() => {
    if (!selectedNote || !hasUnsavedChanges) return;

    const timeoutId = setTimeout(async () => {
      setSaveStatus("saving");

      await updateNote(workspaceId, selectedNote);

      setSaveStatus("saved");
      setHasUnsavedChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [
    selectedNote?.title,
    selectedNote?.content,
    hasUnsavedChanges,
    workspaceId,
  ]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar
          workspaceId={workspaceId}
          notes={notes}
          selectedNoteId={selectedNoteId}
          onCreateNote={async () => {
            const newNote = await createNote(workspaceId);

            setNotes((prev) => [newNote, ...prev]);
            setSelectedNoteId(newNote.id);
            setSaveStatus("saved");
            setHasUnsavedChanges(false);
          }}
          onSelectNote={(id) => {
            setSelectedNoteId(id);
            setSaveStatus("idle");
            setHasUnsavedChanges(false);
          }}
        />

        <NoteEditor
          note={selectedNote}
          isLoading={isLoading}
          error={error}
          saveStatus={saveStatus}
          hasUnsavedChanges={hasUnsavedChanges}
          onDelete={async () => {
            if (!selectedNote) return;

            await deleteNote(workspaceId, selectedNote.id);

            const remainingNotes = notes.filter(
              (note) => note.id !== selectedNote.id
            );

            setNotes(remainingNotes);
            setSelectedNoteId(remainingNotes[0]?.id ?? null);
            setSaveStatus("idle");
            setHasUnsavedChanges(false);
          }}
          onTitleChange={(value) => {
            setSaveStatus("idle");
            setHasUnsavedChanges(true);

            if (!selectedNote) return;

            const updatedNote = {
              ...selectedNote,
              title: value,
            };

            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === selectedNoteId ? updatedNote : note
              )
            );

            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify(updatedNote));
            }
          }}
          onContentChange={(value) => {
            setSaveStatus("idle");
            setHasUnsavedChanges(true);

            if (!selectedNote) return;

            const updatedNote = {
              ...selectedNote,
              content: value,
            };

            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === selectedNoteId ? updatedNote : note
              )
            );

            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify(updatedNote));
            }
          }}
        />
      </div>
    </main>
  );
}