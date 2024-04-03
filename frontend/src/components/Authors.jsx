import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";
import { useRef, useState } from "react";
import Select from "react-select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
    <div className="grid grid-cols-2 gap-4 px-6">
      <Card className="text-left flex flex-col">
        <CardHeader className="text-2xl font-bold">Authors</CardHeader>
        <CardContent className="flex gap-6">
          <div className=" p-4 ">
            <div className="grid grid-cols-3 gap-2 font-semibold border-b-2 border-black py-2">
              <span className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Name
              </span>
              <span className=" px-4 py-2  font-bold [&[align=center]]:text-center [&[align=right]]:text-right text-center">
                Birth Year
              </span>
              <span className=" px-4 py-2  font-bold [&[align=center]]:text-center [&[align=right]]:text-right text-center">
                Book Count
              </span>
            </div>
            {result.data.allAuthors.map((author, i) => {
              return (
                <div
                  className="grid   grid-cols-3 gap-2  border-b py-2"
                  key={i}
                >
                  <span>{author.name}</span>
                  <span className=" text-center">{author.born}</span>
                  <span className=" text-center">{author.bookCount}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col gap-4">
        <CardHeader className="text-2xl font-bold">
          Edit Author Birth Year
        </CardHeader>
        <CardContent className="flex h-full gap-6">
          <form className="flex flex-col h-full gap-2 w-full">
            <span className="flex gap-2">
              <Label
                className="min-w-[80px] flex items-center"
                htmlFor="author"
              >
                Author
              </Label>
              <Select
                ref={select}
                className="w-full"
                onChange={handleChange}
                options={selectOptions}
              />
            </span>
            <span className="flex gap-2">
              <Label
                className="min-w-[80px] flex items-center"
                htmlFor="bornYear"
              >
                Birth Year
              </Label>
              <Input
                className="border border-black px-1"
                type="text"
                name="bornYear"
                value={bornYear}
                onChange={(e) => setBornYear(e.target.value)}
              />
            </span>
            <Button className="self-end" onClick={handleSubmit}>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
