import { useQuery } from "@apollo/client";
import { all_authors } from "../queries";

export const Authors = () => {
  const result = useQuery(all_authors);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="text-left w-96 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Authors</h1>
      <div className=" p-4 border border-black">
        <div className="grid grid-cols-3 gap-2 font-semibold border-b-2 border-black py-2">
          <span>Name</span>
          <span>Born</span>
          <span>Book Count</span>
        </div>
        {result.data.allAuthors.map((author, i) => {
          return (
            <div className="grid grid-cols-3 gap-2  border-b py-2" key={i}>
              <span>{author.name}</span>
              <span>{author.born}</span>
              <span>{author.bookCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
