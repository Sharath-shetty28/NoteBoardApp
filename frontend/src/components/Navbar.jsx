import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header
      style={{
        background:
          "repeating-linear-gradient(50deg, #0a2979, transparent 100px)",
      }}
    >
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary font-mono tracking-tight md:text-4xl">
            NoteBoardApp
          </h1>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>

            <button className="btn btn-info md:btn-info" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
