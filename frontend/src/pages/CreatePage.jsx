import { ArrowLeftIcon, StickyNote, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
// import api from "../lib/axios";
import { createNote } from "../noteService";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const note = { title, content };
      await createNote(note);
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

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
          </Link>

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
                    Create New Note
                  </h2>
                  <p className="text-white/30 text-xs font-mono mt-1 tracking-wide">
                    NEW_NOTE.md
                  </p>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -my-2" />

              {/* ── Form ── */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 flex-1"
              >
                {/* Title Field */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[0.65rem] uppercase tracking-widest text-white/35 flex items-center gap-1.5">
                    <span className="text-indigo-400/60">▸</span> Title
                  </label>
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full flex-1 min-h-40 bg-white/[0.03] border border-indigo-500/20 rounded-xl px-4 py-3 text-white/85 text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] resize-none leading-relaxed font-light"
                  />
                </div>

                {/* ── Submit ── */}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={loading}
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
                          Creating...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Create Note</span>
                        <span className="relative z-10 text-indigo-300/60 font-mono text-xs">
                          ⌘↵
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
