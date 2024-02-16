import { useQuery, useMutation } from "@apollo/client";
import { all_authors, all_books, new_book } from "../queries";
import { useState } from "react";

export const Books = () => {
  const [formdata, setFormdata] = useState({
    title: "",
    author: "",
    published: "",
    genres: [],
  });

  const [genre, setGenre] = useState("");

  const result = useQuery(all_books);
  const [createBook] = useMutation(new_book, {
    refetchQueries: [{ query: all_books }, { query: all_authors }],
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  const handleSubmit = () => {
    let { title, author, published, genres } = formdata;
    published = Number(published);
    createBook({ variables: { title, author, published, genres } });

    setGenre("");
    setFormdata({
      title: "",
      author: "",
      published: "",
      genres: [],
    });
  };

  return (
    <div className="text-left flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Books</h1>
      <div className="flex gap-6">
        <div className="p-4 border border-black">
          <div className="grid grid-cols-4 gap-3 font-semibold border-b-2 border-black py-2">
            <span>Title</span>
            <span>Author</span>
            <span>Published</span>
            <span>Genres</span>
          </div>
          {result.data.allBooks.map((book, i) => {
            return (
              <div
                className="grid grid-cols-4 justify-center items-center gap-2 border-b py-2"
                key={i}
              >
                <span className="flex">{book.title}</span>
                <span className="flex">{book.author}</span>
                <span className="flex">{book.published}</span>
                <span className="flex flex-col gap-1 ">
                  {book.genres.map((genre, i) => {
                    return <span key={i}>"{genre}"</span>;
                  })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Add New Book</h2>
          <div className="p-4 border border-black ">
            <form className="flex flex-col gap-2">
              <span className="flex">
                <label className="min-w-[80px]" htmlFor="title">
                  Title:
                </label>
                <input
                  className="border border-black px-1"
                  type="text"
                  name="title"
                  value={formdata.title}
                  onChange={(e) =>
                    setFormdata({ ...formdata, title: e.target.value })
                  }
                />
              </span>
              <span className="flex">
                <label className="min-w-[80px]" htmlFor="author">
                  Author:
                </label>
                <input
                  className="border border-black px-1"
                  type="text"
                  name="author"
                  value={formdata.author}
                  onChange={(e) =>
                    setFormdata({ ...formdata, author: e.target.value })
                  }
                />
              </span>
              <span className="flex">
                <label className="min-w-[80px]" htmlFor="published">
                  Published:
                </label>
                <input
                  className="border border-black px-1"
                  type="text"
                  name="published"
                  value={formdata.published}
                  onChange={(e) =>
                    setFormdata({ ...formdata, published: e.target.value })
                  }
                />
              </span>
              <span className="flex  gap-1">
                <label className="min-w-[80px] flex" htmlFor="genres">
                  Genres:{" "}
                </label>
                <div className="flex gap-1">
                  {formdata.genres.map((genre, i) => {
                    return <span key={i}>"{genre}"</span>;
                  })}
                </div>
              </span>
            </form>
            <div className="flex">
              <label className="min-w-[80px]" htmlFor="genres">
                Genre:{" "}
              </label>
              <input
                className="border border-black px-1"
                type="text"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
              <button
                onClick={() =>
                  setFormdata({
                    ...formdata,
                    genres: [...formdata.genres, genre],
                  })
                }
                className="ml-2 middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Add Genre
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-2 middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
