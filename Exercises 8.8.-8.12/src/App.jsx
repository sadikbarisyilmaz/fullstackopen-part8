import "./App.css";
import { Authors } from "./components/Authors";
import { Books } from "./components/Books";
// import NewBook from "./components/NewBook";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="h-full flex flex-col gap-4">
      <nav className="py-2">
        <ul className="flex gap-2">
          <li>
            <Link to="/">
              <button className="middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Authors
              </button>
            </Link>
          </li>
          <li>
            <Link to="/books">
              <button className="middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Books
              </button>
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </div>
  );
}

export default App;
