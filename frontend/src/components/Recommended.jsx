import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader } from "./Loader";

export const Recommended = ({ genre }) => {
  const result = useQuery(ALL_BOOKS, { variables: { genre } });

  if (result.loading) {
    return <Loader />;
  }

  return (
    <div className="grid  gap-4 px-6">
      <Card className="text-left flex flex-col gap-4">
        <CardHeader className="text-2xl font-bold">
          Recommended Books
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <h2>
            Books in your fovourite genre: <strong>{genre}</strong>
          </h2>
          <div className="p-4 ">
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
        </CardContent>
      </Card>
    </div>
  );
};
