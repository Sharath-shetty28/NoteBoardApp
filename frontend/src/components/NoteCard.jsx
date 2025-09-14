import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import { deleteNote, syncOfflineNotes } from "../noteService";

import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;

  const handleSync = async (e, id) => {
    e.preventDefault();

    if (!id) {
      toast.error("Note ID missing");
      return;
    }
    if (!window.confirm("Are you sure you want to sync this note?")) return;
    try {
      toast.promise(syncOfflineNotes(id), {
        loading: "Syncing note...",
        success: "Note synced successfully",
        error: "Failed to sync note",
      });
    } catch (err) {
      toast.error("❌ Sync failed:", err);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!id) {
      toast.error("Note ID missing");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      // await api.delete(`/notes/${id}`);
      await deleteNote(id);
      // setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      setNotes((prev) => prev.filter((note) => (note._id || note.id) !== id));
      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <Link
      to={`/note/${note._id || note.id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            {isPWA && (
              <button
                onClick={(e) => handleSync(e, note._id || note.id)}
                className="btn btn-ghost btn-xs"
              >
                Sync Notes
              </button>
            )}

            <PenSquareIcon className="size-4" />
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id || note.id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default NoteCard;
