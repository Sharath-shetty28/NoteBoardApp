import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { syncAllNotes } from "../noteService";
import toast from "react-hot-toast";

const Navbar = () => {
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;

  const handleSync = async (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      toast.error(
        "You are currently offline. Please connect to the internet to sync notes."
      );
      return;
    }
    try {
      toast.promise(syncAllNotes(), {
        loading: "Syncing all notes...",
        success: "All notes synced successfully!",
        error: "Error syncing notes:",
      });
    } catch (err) {
      toast.error("Error syncing notes:", err);
    }
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            NoteBoardApp
          </h1>
          <div className="flex items-center gap-4">
            {isPWA && (
              <button
                onClick={(e) => handleSync(e)}
                className="btn bg-green-500 btn-xs"
              >
                Sync All Notes
              </button>
            )}
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
