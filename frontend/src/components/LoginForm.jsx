import { useState, useEffect } from "react";
import { split, useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import { useApolloContext } from "../apolloContext";
import { getMainDefinition } from "@apollo/client/utilities";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";

export const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setContextSplitLink, authLink, httpLink, wsLink } =
    useApolloContext();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
    }
  }, [result.data]);

  const submit = async (event) => {
    event.preventDefault();
    //Fixes login problem
    setContextSplitLink(
      split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
    );
    login({ variables: { username, password } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome !</CardTitle>
        <CardDescription>Please Log in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="w-full grid gap-2" onSubmit={submit}>
          <div className="flex items-center">
            <Label className="min-w-[80px]" htmlFor="username">
              Username
            </Label>
            <Input
              value={username}
              placeholder="admin"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className="flex items-center">
            <Label className="min-w-[80px]" htmlFor="password">
              Password
            </Label>
            <Input
              type="password"
              placeholder="secret"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </CardContent>
    </Card>
    // <div className="flex justify-center items-center p-4 border border-black">
    //   <form onSubmit={submit}>
    //     <div className="flex">
    //       <Label className="min-w-[80px]" htmlFor="username">
    //         Username
    //       </Label>
    //       <Input
    //
    //         value={username}
    //         placeholder="admin"
    //         onChange={({ target }) => setUsername(target.value)}
    //       />
    //     </div>
    //     <div className="flex">
    //       <Label className="min-w-[80px]" htmlFor="password">
    //         Password
    //       </Label>
    //       <Input
    //
    //         type="password"
    //         placeholder="secret"
    //         value={password}
    //         onChange={({ target }) => setPassword(target.value)}
    //       />
    //     </div>
    //     <Button
    //       // className="mt-4 w-full middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    //       type="submit"
    //     >
    //       Login
    //     </Button>
    //   </form>
    // </div>
  );
};
