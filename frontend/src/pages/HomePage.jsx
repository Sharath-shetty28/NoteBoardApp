import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { fetchNotes } from "../noteService";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const res = await fetch(`/api/notes?page=${page + 1}&limit=10`);
    const data = await res.json();
    setNotes((prev) => [...prev, ...data.notes]);
    setHasMore(data.hasMore);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await fetchNotes();
        if (page === 1) setNotes(res.notes);
        else setNotes((prev) => [...prev, ...res.notes]);
        setHasMore(res.hasMore);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes:", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              onClick={loadMore}
              className="relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 overflow-hidden
                                  bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/60 hover:border-indigo-400/80
                                  hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px
                                  active:translate-y-0 active:shadow-none
                                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              {/* Button shimmer overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Load More</span>
              <span className="relative z-10 text-indigo-300/60 font-mono text-xs">
                ⌘
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
