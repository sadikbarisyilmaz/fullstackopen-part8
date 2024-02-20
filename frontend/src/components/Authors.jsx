import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";
import { useRef, useState } from "react";
import Select from "react-select";

export const Authors = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [bornYear, setBornYear] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const select = useRef();
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  const selectOptions = result.data.allAuthors.map((author) => {
    return { value: author.name, label: author.name };
  });

  const handleChange = (selectOptions) => {
    setSelectedAuthor(selectOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = selectedAuthor.value;
    const setBornTo = Number(bornYear);
    updateAuthor({ variables: { name, setBornTo } });
    setSelectedAuthor(null);
    select.current.clearValue();
    setBornYear("");
  };

  return (
    <div className="text-left flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Authors</h1>
      <div className="flex gap-6">
        <div className=" p-4 border border-black">
          <div className="grid grid-cols-2 gap-2 font-semibold border-b-2 border-black py-2">
            <span>Name</span>
            <span className=" text-center">Birth Year</span>
            {/* <span>Book Count</span> */}
          </div>
          {result.data.allAuthors.map((author, i) => {
            return (
              <div className="grid   grid-cols-2 gap-2  border-b py-2" key={i}>
                <span>{author.name}</span>
                <span className=" text-center">{author.born}</span>
                {/* <span>{author.bookCount}</span> */}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Edit Author Birth Year</h2>
          <div className="p-4 border border-black">
            <form className="flex flex-col gap-2">
              <span className="flex gap-2">
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
              <span className="flex gap-2">
                <label className="min-w-[80px]" htmlFor="bornYear">
                  Birth Year
                </label>
                <input
                  className="border border-black px-1"
                  type="text"
                  name="bornYear"
                  value={bornYear}
                  onChange={(e) => setBornYear(e.target.value)}
                />
              </span>
              <button
                onClick={handleSubmit}
                className=" mt-2 middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
