import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

export const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

    login({ variables: { username, password } });
  };

  return (
    <div className="flex justify-center items-center p-4 border border-black">
      <form onSubmit={submit}>
        <div className="flex">
          <label className="min-w-[80px]" htmlFor="username">
            Username
          </label>
          <input
            className="border border-black px-1"
            value={username}
            placeholder="admin"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div className="flex">
          <label className="min-w-[80px]" htmlFor="password">
            Password
          </label>
          <input
            className="border border-black px-1"
            type="password"
            placeholder="secret"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button
          className="mt-4 w-full middle none center rounded-sm bg-amber-500 py-1 px-2 font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};
