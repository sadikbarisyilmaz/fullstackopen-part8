import { useMutation, useQuery } from "@apollo/client";
import { all_books, new_book, all_genres } from "../queries";
import Select from "react-select";
import { useState, useRef } from "react";

export const Books = () => {
  const [formdata, setFormdata] = useState({
    title: "",
    published: "",
    genres: [],
  });

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [genre, setGenre] = useState("");
  const select = useRef();
  const result = useQuery(all_books, { variables: { genre } });
  const genresResult = useQuery(all_genres);

  const [createBook] = useMutation(new_book, {
    refetchQueries: [{ query: all_books, variables: { genre } }],
  });

  const uniqueAuthors = (booksArr) => {
    const arr = [];
    const authorsExtractedArr = booksArr.map((book) => {
      return { value: book.author.id, label: book.author.name };
    });

    authorsExtractedArr.forEach((book) => {
      arr.some((author) => author.value === book.value) ? "" : arr.push(book);
    });
    return arr;
  };

  if (result.loading) {
    return <div>loading...</div>;
  }

  const selectOptions = uniqueAuthors(result.data.allBooks);
  const handleChange = (selectOptions) => {
    setSelectedAuthor(selectOptions);
  };

  const handleSubmit = () => {
    let { title, published, genres } = formdata;
    published = Number(published);
    const author = selectedAuthor.value;
    console.log({ title, author, published, genres });
    createBook({ variables: { title, author, published, genres } });
    // setIsUpdated(true);
    select.current.clearValue();
    setNewGenre("");
    setFormdata({
      title: "",
      published: "",
      genres: [],
    });
  };

  const extractGenres = (booksArr) => {
    const genres = [];
    booksArr.forEach((book) => {
      book.genres.forEach((booksGenre) => {
        genres.some((genre) => genre === booksGenre)
          ? ""
          : genres.push(booksGenre);
      });
    });
    return genres;
  };

  const genres = extractGenres(result.data.allBooks);
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
                <span className="flex">{book.author.name}</span>
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
                  className="border border-black px-1 w-full"
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
                  Author
                </label>
                <Select
                  ref={select}
                  className="w-full"
                  onChange={handleChange}
                  options={selectOptions}
                />
              </span>
              <span className="flex">
                <label className="min-w-[80px]" htmlFor="published">
                  Published:
                </label>
                <input
                  className="border border-black px-1 w-full"
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
                name="newGenre"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
              />
              <button
                onClick={() =>
                  setFormdata({
                    ...formdata,
                    genres: [...formdata.genres, newGenre],
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
          <div>
            <h2 className="text-xl font-bold">Genre Filters</h2>
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                className="middle none center rounded-sm bg-amber-900 py-1 px-2 font-sans text-xs font-bold  text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={() => setGenre("")}
              >
                See All
              </button>
              {genresResult &&
                genresResult.data.allGenres.map((genre, i) => {
                  return (
                    <button
                      className="middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold  text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      key={i}
                      onClick={() => setGenre(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
