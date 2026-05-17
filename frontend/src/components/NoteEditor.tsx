import { Note } from "@/lib/api/notes";

type NoteEditorProps = {
  note: Note | undefined;
  isLoading: boolean;
  error: string | null;
  saveStatus: "idle" | "saving" | "saved";
  hasUnsavedChanges: boolean;
  onDelete: () => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function NoteEditor({
  note,
  isLoading,
  error,
  saveStatus,
  hasUnsavedChanges,
  onDelete,
  onTitleChange,
  onContentChange,
}: NoteEditorProps) {
  return (
    <section className="flex-1 p-10">
      <div className="bg-white rounded-xl shadow p-8 h-[90vh]">
        {isLoading && <p className="text-gray-500">Loading notes...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !note && !error && (
          <p className="text-gray-500">No note selected.</p>
        )}

        {note && (
          <>
            <input
              value={note.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled Note"
              className="text-5xl font-extrabold text-black w-full outline-none"
            />

            <button
              onClick={onDelete}
              className="mt-4 text-sm text-red-500 hover:text-red-700"
            >
              Delete Note
            </button>

            <p className="mt-2 text-sm text-gray-400">
              {saveStatus === "idle" &&
                hasUnsavedChanges &&
                "Unsaved changes"}
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" && "Saved"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Last updated: {new Date(note.updated_at).toLocaleString()}
            </p>


            <textarea
              value={note.content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Start typing..."
              className="mt-6 w-full h-[75vh] resize-none outline-none text-gray-700"
            />
          </>
        )}
      </div>
    </section>
  );
}