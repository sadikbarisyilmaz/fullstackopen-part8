import { gql, useQuery } from "@apollo/client";

const all_books = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`;

export const Books = () => {
  const result = useQuery(all_books);

  if (result.loading) {
    return <div>loading...</div>;
  }

  console.log(result.data);

  return (
    <div className="text-left w-96 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Books</h1>
      <div className=" p-4 border border-black">
        <div className="grid grid-cols-3 gap-2 font-semibold">
          <span>Title</span>
          <span>Author</span>
          <span>Published</span>
        </div>
        {result.data.allBooks.map((book, i) => {
          return (
            <div className="grid grid-cols-3 gap-2" key={i}>
              <span>{book.title}</span>
              <span>{book.author}</span>
              <span>{book.published}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
