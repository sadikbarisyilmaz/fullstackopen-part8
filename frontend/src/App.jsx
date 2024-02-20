import "./App.css";
import { useState } from "react";
import { Authors } from "./components/Authors";
import { Books } from "./components/Books";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { useApolloClient, useQuery } from "@apollo/client";
import { Recommended } from "./components/Recommended";
import { me } from "./queries";

function App() {
  const [token, setToken] = useState(null);
  const result = useQuery(me);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div className="h-screen flex flex-col gap-4 justify-center items-center">
        {/* <Notify errorMessage={errorMessage} /> */}
        <h2 className="text-2xl font-bold">Login</h2>
        <LoginForm
          setToken={setToken}
          //  setError={notify}
        />
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col gap-4">
      <nav className="py-2">
        <ul className="flex gap-2">
          <li>
            <Link to="/">
              <button className="middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Books
              </button>
            </Link>
          </li>
          <li>
            <Link to="/authors">
              <button className="middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Authors
              </button>
            </Link>
          </li>

          <li>
            <Link to="/recommended">
              <button className="middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Recommended
              </button>
            </Link>
          </li>
          <li>
            <button
              className=" ml-6 middle none center rounded-sm bg-amber-900 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={logout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Books />} />
        {result.data.me.favoriteGenre && (
          <Route
            path="/recommended"
            element={<Recommended genre={result.data.me.favoriteGenre} />}
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
