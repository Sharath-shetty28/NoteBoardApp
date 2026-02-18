import { PenSquareIcon, Trash2Icon, Clock, Tag } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import { deleteNote } from "../noteService";

import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour
    if (!id) {
      toast.error("Note ID missing");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => (note._id || note.id) !== id));
      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="group relative bg-gray-950 border border-indigo-500/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Top shimmer bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Radial background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.07),transparent)] pointer-events-none" />

      <div className="relative p-5 flex flex-col gap-3">
        {/* ── Header: Title + Actions ── */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-white/90 text-base leading-snug tracking-tight line-clamp-2 flex-1">
            {note.title}
          </h3>

          <div className="flex items-center gap-0.5 shrink-0 -mt-0.5">
            <Link
              to={`/note/${note.id}`}
              title="Edit note"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white/35 hover:text-indigo-400 hover:bg-indigo-500/15 transition-all duration-150 hover:scale-110"
            >
              <PenSquareIcon size={15} />
            </Link>
            <button
              title="Delete note"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white/35 hover:text-rose-400 hover:bg-rose-500/15 transition-all duration-150 hover:scale-110"
              onClick={(e) => handleDelete(e, note.id)}
            >
              <Trash2Icon size={15} />
            </button>
          </div>
        </div>

        {/* ── Content Preview ── */}
        <p className="text-white/45 text-sm leading-relaxed font-light line-clamp-3">
          {note.content}
        </p>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

        {/* ── Footer: Date + Tags ── */}
        <div className="flex flex-wrap-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-white/30 shrink-0">
            <Clock size={11} />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest">
              {formatDate(new Date(note.createdAt))}
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.tags?.length > 0 ? (
              <>
                <Tag size={11} className="text-indigo-400/60 shrink-0" />
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="font-mono text-[0.65rem] text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full tracking-wide hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-all duration-150 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </>
            ) : (
              <span className="font-mono text-[0.65rem] text-white/55 tracking-widest uppercase">
                no tags
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteCard;
