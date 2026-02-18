import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header
      style={{
        background:
          "repeating-linear-gradient(190deg, #0a2979, transparent 100px)",
      }}
    >
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary font-mono tracking-tight md:text-4xl">
            NoteBoardApp
          </h1>
          <div className="flex items-center gap-4 ">
            <Link to={"/create"} className="relative inline-flex items-center gap-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 overflow-hidden
                                  bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/60 hover:border-indigo-400/80
                                  hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-px
                                  active:translate-y-0 active:shadow-none
                                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>

            <button className="btn btn-info md:btn-info px-3 py-0" onClick={logout}>
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
