import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, MutationFunction, MutationResult } from "@apollo/client";
import { SignUpMutation } from "../../graphql/mutation/signup";
import {SendCodeMutation} from "../../graphql/mutation/send_code";
import {ConfirmCodeMutation} from "../../graphql/mutation/confirm_code";

interface SignUpResponse {
    signUp: {
        token: string | null;
    }
}

interface SendCodeResponse {
    emailMutations: {
        sendCode: {
            id: string;
        }
    }
}

interface ConfirmCodeResponse {
    confirmCode: {
        id: string;
    } | null;
}

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [codeId, setCodeId] = useState("");
    const [isCodeConfirmed, setIsCodeConfirmed] = useState(false); // State to track code confirmation
    const navigate = useNavigate();

    const [signUpMutation] = useMutation<SignUpResponse>(SignUpMutation);
    const [sendCodeMutation] = useMutation<SendCodeResponse>(SendCodeMutation);
    const [confirmCodeMutation] = useMutation<ConfirmCodeResponse>(ConfirmCodeMutation);

    useEffect(() => {
        // Enable the Sign Up button only if the code is confirmed
        if (isCodeConfirmed) {
            setError(""); // Clear any previous errors
        }
    }, [isCodeConfirmed]);

    const signUp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await signUpMutation({
                variables: {
                    input: {
                        username,
                        password,
                        // email,
                    },
                },
            });
            if (response.data?.signUp?.token != null) {
                localStorage.setItem("token", response.data.signUp.token)
                navigate("/overview");
                return
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setError("An error occurred during signup. Please try again later.");
        }
    };

    const sendCode = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            const response = await sendCodeMutation({
                variables: {
                    input: {
                        email,
                    },
                },
            });
            setCodeId(response.data?.emailMutations?.sendCode?.id || "");
        } catch (error) {
            console.error("Error sending code:", error);
            setError("An error occurred while sending code. Please try again later.");
        }
    };

    const confirmCode = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            const response = await confirmCodeMutation({
                variables: {
                    input: {
                        id: codeId,
                        code,
                    },
                },
            });
            console.log("Code confirmed successfully:", response.data?.confirmCode);
            setIsCodeConfirmed(true); // Set code confirmation status to true
        } catch (error) {
            console.error("Error confirming code:", error);
            setError("An error occurred while confirming code. Please try again later.");
        }
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    return (
        <div className="mt-20 w-full flex justify-center">
            <form
                className="ring-2 ring-gray-100 custom-shadow rounded-3xl px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 lg:w-1/3"
                onSubmit={(event) => signUp(event)}
            >
                <h1 className="text-2xl font-semibold mb-6 text-center">SignUp</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>


                <span className="block text-gray-700 text-sm font-bold mr-2" >
                        Email
                </span>

                <div className="mt-2 mb-4 flex">
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <button
                        className="bg-base font-bold text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                        onClick={sendCode}
                    >
                        Send
                    </button>
                </div>
                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                <span className="block text-gray-700 text-sm font-bold mr-2" >
                        Code
                </span>
                <div className="mt-2 mb-4 flex">
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="code"
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                    />
                    {!isCodeConfirmed && (
                        <button
                            className="bg-base font-bold py-2 px-4 text-sm rounded focus:outline-none focus:shadow-outline ml-2"
                            onClick={confirmCode}
                        >
                            Confirm
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className={`bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!isCodeConfirmed && 'cursor-not-allowed opacity-50'}`}
                        type="submit"
                        disabled={!isCodeConfirmed}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}
