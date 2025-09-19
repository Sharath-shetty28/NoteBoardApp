import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { authUser, logout } = useAuth();

  return (
    <header
      style={{
        background:
          "repeating-linear-gradient(50deg, #0a2979, transparent 100px)",
      }}
    >
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            NoteBoardApp
          </h1>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
            {authUser && (
              <button className="btn btn-info" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
