import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import { LoginMutation } from "../../graphql/mutation/login"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [loginMutation] = useMutation(LoginMutation);

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await loginMutation({
                variables: {
                    input: {
                        "username": username,
                        "password": password,
                    },
                },
            });
            if (response.data.login.token != null) {
                localStorage.setItem("token", response.data.login.token)
                navigate("/profile");
                return
            }

        } catch (error) {
            console.error("Error during login:", error);
            setError("An error occurred during login. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                className="bg-gradient-to-r from-blue-200 to-purple-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 lg:w-1/3"
                onSubmit={(event) => login(event)}
            >
                <h1 className="text-xl font-semibold mb-6 text-center">Login</h1>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gradient-to-r from-blue-100 to-purple-100"
                        id="username"
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gradient-to-r from-blue-100 to-purple-100"
                        id="password"
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                {error && (
                    <div className="mb-4 text-red-500 text-sm">{error}</div>
                )}
                <div className="flex items-center justify-center">
                    <button
                        className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-gradient-to-r from-purple-300 to-blue-300"
                        type="submit"
                    >
                        Log In
                    </button>
                </div>
            </form>
        </div>

    );
}
