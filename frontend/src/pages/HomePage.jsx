import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { fetchNotes } from "../noteService";
import { useAuth } from "../AuthContext";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser, logout } = useAuth();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await fetchNotes();
        setNotes(res);
        // console.log("Fetched notes:", res);
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

  if (!authUser) return <p>You are not logged in</p>;

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}
        <h1>Welcome {authUser.username}</h1>
        <button onClick={logout}>Logout</button>

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
