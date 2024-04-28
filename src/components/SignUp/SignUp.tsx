import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from "@apollo/client";
import { WalletsQuery } from "../../graphql/query/wallets";
import { FlowsQuery } from "../../graphql/query/flows";
import { LoginMutation } from "../../graphql/mutation/login";
import { CreateRegistrationMutation } from "../../graphql/mutation/create_registration";
import { SetEmailMutation } from "../../graphql/mutation/set_email";
import { ConfirmEmailMutation } from "../../graphql/mutation/confirm_email";
import { SetCredentialsMutation } from "../../graphql/mutation/set_registration_credentials";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const registrationIDName = "registration-id"

type Flow = {
    id: string
    type: string
    state: string
}
const RegistrationWorkflow = () => {
    const navigate = useNavigate();

    const [registrationID, setRegistrationID] = useState<string | null>("")
    const [flow, setFlow] = useState<Flow | null>(null);
    const [errors, setErrors] = useState<string[]>([]); // State for errors

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailLoading, setEmailLoading] = useState(false);
    const [codeLoading, setCodeLoading] = useState(false);
    const [credentialsLoading, setCredentialsLoading] = useState(false);

    const { loading, error, data } = useQuery(FlowsQuery, {
        variables: {
            filter: {
                idIn: [registrationID],
            }
        },
    });

    const [createRegistrationMutation] = useMutation(CreateRegistrationMutation);

    const [setEmailMutation] = useMutation(SetEmailMutation);

    const [confirmEmailMutation] = useMutation(ConfirmEmailMutation);

    const [setCredentialsMutation] = useMutation(SetCredentialsMutation);

    const [loginMutation] = useMutation(LoginMutation);

    const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setEmailLoading(true);
            const response = await setEmailMutation({
                variables: {
                    input: {
                        id: registrationID,
                        email: email,
                    }
                },
            });
            setEmailLoading(false);
            setErrors([]); // Clear errors on successful submission
        } catch (error: any) {
            console.error("Error during login:", error);
            setErrors([error.message]);
            setEmailLoading(false);
            return ""
        }
    };

    const handleCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setCodeLoading(true);
            const response = await confirmEmailMutation({
                variables: {
                    input: {
                        id: registrationID,
                        code: code,
                    }
                },
            });
            setCodeLoading(false);
            setErrors([]); // Clear errors on successful submission
        } catch (error: any) {
            console.error("Error during login:", error);
            setErrors([error.message]);
            setCodeLoading(false);
            return ""
        }
    };

    const handleCredentialsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setCredentialsLoading(true);
            const response = await setCredentialsMutation({
                variables: {
                    input: {
                        id: registrationID,
                        username: username,
                        password: password,
                    }
                },
            });
            setCredentialsLoading(false);
            setErrors([]); // Clear errors on successful submission
            localStorage.setItem(registrationIDName, "")

            const loginResp = await loginMutation({
                variables: {
                    input: {
                        username: username,
                        password: password,
                    },
                },
            });
            if (loginResp.data.login.token != null) {
                localStorage.setItem("token", loginResp.data.login.token);
                navigate("/overview");
                return;
            }

        } catch (error: any) {
            console.error("Error during login:", error);
            setErrors([error.message]);
            setCredentialsLoading(false);
            return ""
        }
    };

    useEffect(() => {
        let regID = localStorage.getItem(registrationIDName)

        if (regID !== null && regID !== "") {
            setRegistrationID(regID)
            return
        }

        createRegistration().then(() => { })

    }, [])


    useEffect(() => {
        if (data) {
            setFlow(data.flows.items[0])
        }

        // if (flow?.state === "COMPLETED") {
        //     navigate("/overview");
        // }
    })

    const createRegistration = async (): Promise<string> => {
        try {
            const response = await createRegistrationMutation({
                    variables: {},
                }
            );
            let id = response.data.registrationMutations.createRegistration.id
            setRegistrationID(id)
            localStorage.setItem(registrationIDName, id)
            return id
        } catch (error: any) {
            console.error("Error during login:", error);
            setErrors([error.message]);
            return ""
        }
    };

    const passwordsMatch = password === confirmPassword;

    return (
        <section>
            {/*<Header/>*/}

            <div className="mt-32 w-full flex flex-col items-center">
                <div className="mt-6 md:mt-12 p-4  max-w-md w-full">
                    <div className="text-center">
                        <span className="text-xl font-semibold">Registration</span>
                    </div>

                    {flow?.state === "WAITING_EMAIL" && (
                        <div className="mt-10 custom-shadow rounded-xl p-8 text-center">
                            <form onSubmit={(event) => handleEmailSubmit(event)}>
                                <label htmlFor="email" className="block mb-2 text-sm text-left font-medium text-gray-900">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="email@example.com"
                                       value={email}
                                       onChange={({ target }) => setEmail(target.value)}
                                />
                                <button
                                    className="mt-4 bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={emailLoading}
                                >
                                    {emailLoading ? 'Loading...' : 'Next'}
                                </button>
                            </form>
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-500 mt-2">{error}</p>
                            ))}
                        </div>
                    )}

                    {flow?.state === "WAITING_EMAIL_CONFIRMATION" && (
                        <div className="mt-10 custom-shadow rounded-2xl p-8 text-center">
                            <form onSubmit={(event) => handleCodeSubmit(event)}>
                                <label htmlFor="code" className="block mb-2 text-sm text-left font-medium text-gray-900">Confirmation code</label>
                                <input
                                    type="text"
                                    id="code"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="111111"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <button
                                    className="mt-4 bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={codeLoading}
                                >
                                    {codeLoading ? 'Loading...' : 'Next'}
                                </button>
                            </form>
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-500 mt-2">{error}</p>
                            ))}
                        </div>
                    )}

                    {flow?.state === "WAITING_CREDENTIALS" && (
                        <form onSubmit={(e) => handleCredentialsSubmit(e)}>
                            <div className="mt-10 custom-shadow rounded-2xl p-8 text-center">

                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-left text-gray-900">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="example"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <label htmlFor="password" className="mt-4 block mb-2 text-sm font-medium text-left text-gray-900">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="******"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <label htmlFor="confirmPassword" className="mt-4 block mb-2 text-sm font-medium text-left text-gray-900">Confirm password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="******"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                                <button
                                    className="mt-6 bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={credentialsLoading || !passwordsMatch}
                                >
                                    {credentialsLoading ? 'Loading...' : 'Sign Up'}
                                </button>
                                {!passwordsMatch && (
                                    <p className="text-red-500 mt-2">Passwords do not match</p>
                                )}
                                {errors.map((error, index) => (
                                    <p key={index} className="text-red-500 mt-2">{error}</p>
                                ))}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RegistrationWorkflow;
