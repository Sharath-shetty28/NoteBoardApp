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
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
