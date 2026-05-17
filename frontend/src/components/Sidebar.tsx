import { Note } from "@/lib/api/notes";

type SidebarProps = {
  workspaceId: string;
  notes: Note[];
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
  onCreateNote: () => void;
};

export default function Sidebar({
  workspaceId,
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
}: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold">Realtime Notes</h1>
      <p className="mt-2 text-xs text-gray-400 break-all">
        Workspace: {workspaceId}
      </p>

      <button
        onClick={onCreateNote}
        className="mt-6 w-full bg-white text-black py-2 rounded-lg"
      >
        + New Note
      </button>

      <div className="mt-8 space-y-2">
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`w-full text-left p-3 rounded ${selectedNoteId === note.id
                ? "bg-gray-600"
                : "bg-gray-800"
              }`}
          >
            {note.title}
          </button>
        ))}
      </div>
    </aside>
  );
}