import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

export const Recommended = ({ genre }) => {
  const result = useQuery(ALL_BOOKS, { variables: { genre } });

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="text-left flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Recommended Books</h1>
      <h2>
        Books in your fovourite genre: <strong>{genre}</strong>
      </h2>
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
      </div>
    </div>
  );
};
