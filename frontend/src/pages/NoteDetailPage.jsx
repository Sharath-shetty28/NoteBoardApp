import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { fetchNote, updateNote, deleteNote } from "../noteService";
import {
  ArrowLeftIcon,
  LoaderIcon,
  StickyNote,
  Loader2,
  Trash2Icon,
} from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetchNote(id);
        setNote(res);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }
    setLoading(true);
    try {
      await updateNote(id, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }
  if (!note) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col flex-1">
        <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
          {/* ── Back Button ── */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-indigo-400 transition-all duration-200 hover:-translate-x-1 mb-8 w-fit group"
            >
              <ArrowLeftIcon
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              <span className="font-mono text-xs uppercase tracking-widest">
                Back to Notes
              </span>
            </Link>{" "}
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline w-fit"
            >
              <Trash2Icon
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              <span className="font-mono text-xs uppercase tracking-widest">
                Delete Note
              </span>
            </button>
          </div>
          {/* ── Card ── */}
          <div className="relative bg-gray-950 border border-indigo-500/20 rounded-2xl overflow-hidden flex-1 flex flex-col">
            {/* Top shimmer bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-70" />

            {/* Inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_0%,rgba(99,102,241,0.07),transparent)] pointer-events-none" />

            <div className="relative p-6 sm:p-8 flex flex-col gap-7 flex-1">
              {/* ── Heading ── */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25">
                  <StickyNote size={16} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white/90 text-xl tracking-tight leading-none">
                    Update Note
                  </h2>
                  <p className="text-white/30 text-xs font-mono mt-1 tracking-wide">
                    UPDATED_NOTE.md
                  </p>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -my-2" />
              {/* Title Field */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[0.65rem] uppercase tracking-widest text-white/35 flex items-center gap-1.5">
                  <span className="text-indigo-400/60">▸</span> Title
                </label>
                <input
                  type="text"
                  placeholder="Note title..."
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  className="w-full bg-white/[0.03] border border-indigo-500/20 rounded-xl px-4 py-3 text-white/85 text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] font-medium tracking-tight"
                />
              </div>

              {/* Content Field */}
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-mono text-[0.65rem] uppercase tracking-widest text-white/35 flex items-center gap-1.5">
                  <span className="text-indigo-400/60">▸</span> Content
                </label>
                <textarea
                  placeholder="Write your note here..."
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                  className="w-full flex-1 min-h-40 bg-white/[0.03] border border-indigo-500/20 rounded-xl px-4 py-3 text-white/85 text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] resize-none leading-relaxed font-light"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSave}
                  className="relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 overflow-hidden
                      bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/60 hover:border-indigo-400/80
                      hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px
                      active:translate-y-0 active:shadow-none
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                  {/* Button shimmer overlay */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

                  {loading ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin relative z-10"
                      />
                      <span className="relative z-10 font-mono text-xs tracking-widest uppercase">
                        Updating...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Update Note</span>
                      <span className="relative z-10 text-indigo-300/60 font-mono text-xs">
                        ⌘
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
