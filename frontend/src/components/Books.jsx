import { useMutation, useQuery } from "@apollo/client";
import { ALL_BOOKS, ADD_BOOK, ALL_GENRES, ALL_AUTHORS } from "../queries";
import Select from "react-select";
import { useState, useRef } from "react";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
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
  const result = useQuery(ALL_BOOKS, { variables: { genre } });
  const genresResult = useQuery(ALL_GENRES);

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS, variables: { genre } },
      { query: ALL_AUTHORS },
    ],
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
    return (
      <div className="flex w-full justify-center items-center mt-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const selectOptions = uniqueAuthors(result.data.allBooks);
  const handleChange = (selectOptions) => {
    setSelectedAuthor(selectOptions);
  };

  const handleSubmit = () => {
    let { title, published, genres } = formdata;
    published = Number(published);
    const author = selectedAuthor.value;
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
    <div className="flex flex-col gap-4 px-6">
      <Card className="text-left flex flex-col  px-6">
        <CardHeader className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Books
        </CardHeader>
        <CardContent className="flex">
          <div className="">
            <div className="grid grid-cols-4 gap-3 font-semibold -b-2  py-2">
              <span className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Title
              </span>
              <span className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Author
              </span>
              <span className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Published
              </span>
              <span className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Genres
              </span>
            </div>
            <Separator className="bg-black" />

            {result.data.allBooks.map((book, i) => {
              return (
                <>
                  <div
                    className="grid grid-cols-4 justify-center items-center gap-2 -b py-2"
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
                  <Separator className="bg-black" />
                </>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardHeader className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Add New Book
        </CardHeader>

        <CardContent className="flex flex-col">
          <form className="flex flex-col gap-2">
            <span className="flex">
              <Label className="min-w-[80px] flex items-center" htmlFor="title">
                Title:
              </Label>
              <Input
                className="  px-1 w-full"
                type="text"
                name="title"
                value={formdata.title}
                onChange={(e) =>
                  setFormdata({ ...formdata, title: e.target.value })
                }
              />
            </span>
            <span className="flex">
              <Label
                className="min-w-[80px] flex items-center"
                htmlFor="author"
              >
                Author
              </Label>
              <Select
                ref={select}
                className="w-full "
                onChange={handleChange}
                options={selectOptions}
              />
            </span>
            <span className="flex">
              <Label
                className="min-w-[80px] flex items-center"
                htmlFor="published"
              >
                Published:
              </Label>
              <Input
                className="  px-1 w-full"
                type="text"
                name="published"
                value={formdata.published}
                onChange={(e) =>
                  setFormdata({ ...formdata, published: e.target.value })
                }
              />
            </span>
            <span className="flex h-[40px] items-center gap-1">
              <Label
                className="min-w-[80px] flex items-center "
                htmlFor="genres"
              >
                Genres:{" "}
              </Label>
              <div className="flex gap-1">
                {formdata.genres.map((genre, i) => {
                  return <span key={i}>"{genre}"</span>;
                })}
              </div>
            </span>
          </form>
          <div className="flex">
            <Label className="min-w-[80px] flex items-center" htmlFor="genres">
              Genre:{" "}
            </Label>
            <Input
              className="  px-1"
              type="text"
              name="newGenre"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
            />
            <Button
              variant="outline mt-4"
              onClick={() =>
                setFormdata({
                  ...formdata,
                  genres: [...formdata.genres, newGenre],
                })
              }
            >
              Add Genre
            </Button>
          </div>
          <Button className="mt-4" onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
        <CardContent>
          <h2 className="text-xl font-bold">Genre Filters</h2>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button onClick={() => setGenre("")}>See All</Button>
            {genresResult &&
              genresResult.data.allGenres.map((genre, i) => {
                return (
                  <Button
                    variant="outline"
                    key={i}
                    onClick={() => setGenre(genre)}
                  >
                    {genre}
                  </Button>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
