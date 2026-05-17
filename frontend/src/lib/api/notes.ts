export type Note = {
  id: number;
  workspace_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getNotes(workspaceId: string) {
  const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/notes`);
  const result = await res.json();
  return result.data as Note[];
}

export async function createNote(workspaceId: string) {
  const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Untitled Note",
      content: "",
    }),
  });

  const result = await res.json();
  return result.data as Note;
}

export async function updateNote(workspaceId: string, note: Note) {
  const res = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/notes/${note.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: note.title,
        content: note.content,
      }),
    }
  );

  const result = await res.json();
  return result.data as Note;
}

export async function deleteNote(workspaceId: string, noteId: number) {
  await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/notes/${noteId}`, {
    method: "DELETE",
  });
}