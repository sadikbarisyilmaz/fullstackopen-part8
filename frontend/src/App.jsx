import "./App.css";
import { useState } from "react";
import { Authors } from "./components/Authors";
import { Books } from "./components/Books";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { Recommended } from "./components/Recommended";
import { BOOK_ADDED, ALL_BOOKS, ME } from "./queries";
import { Button } from "./components/ui/button";
import { Loader } from "./components/Loader";

function App() {
  const [token, setToken] = useState(null);
  const result = useQuery(ME);
  const client = useApolloClient();

  const refetch = async (query) => {
    await client.refetchQueries({
      include: [query],
    });
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      refetch(ALL_BOOKS);
      // notify(`${addedBook.title} added`)
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div className="h-screen flex flex-col gap-4 justify-center items-center">
        {/* <Notify errorMessage={errorMessage} /> */}
        <LoginForm
          setToken={setToken}
          //  setError={notify}
        />
      </div>
    );
  }

  if (!result.data) {
    return <Loader />;
  }

  return (
    <div className="h-full flex flex-col gap-4 ">
      <nav className="py-2 w-full flex justify-around shadow-md bg-primary text-white">
        <ul className="flex ">
          <li>
            <Link to="/">
              <Button variant="ghost">Books</Button>
            </Link>
          </li>
          <li>
            <Link to="/authors">
              <Button variant="ghost">Authors</Button>
            </Link>
          </li>

          <li>
            <Link to="/recommended">
              <Button variant="ghost">Recommended</Button>
            </Link>
          </li>
        </ul>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </nav>
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Books />} />
        {result && (
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
