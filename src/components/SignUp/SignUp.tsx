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

    const handleEmailSubmit = async () => {
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

    const handleCodeSubmit = async () => {
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

    const handleCredentialsSubmit = async () => {
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

        if (flow?.state === "COMPLETED") {
            navigate("/overview");
        }
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
        <div className="mt-6 md:mt-12 p-4  max-w-md w-full">
            <div className="text-center">
                <span className="text-xl font-semibold">Registration</span>
            </div>

            {flow?.state === "WAITING_EMAIL" && (
                <div className="mt-10 custom-shadow rounded-xl p-8 text-center">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        className="mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleEmailSubmit}
                        disabled={emailLoading}
                    >
                        {emailLoading ? 'Loading...' : 'Next'}
                    </button>
                    {errors.map((error, index) => (
                        <p key={index} className="text-red-500 mt-2">{error}</p>
                    ))}
                </div>
            )}
            {flow?.state === "WAITING_EMAIL_CONFIRMATION" && (
                <div className="mt-10 custom-shadow rounded-2xl p-8 text-center">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="code">
                        Confirmation code
                    </label>
                    <input
                        type="text"
                        id="code"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                        className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleCodeSubmit}
                        disabled={codeLoading}
                    >
                        {codeLoading ? 'Loading...' : 'Next'}
                    </button>
                    {errors.map((error, index) => (
                        <p key={index} className="text-red-500 mt-2">{error}</p>
                    ))}
                </div>
            )}
            {flow?.state === "WAITING_CREDENTIALS" && (
                <div className="mt-10 custom-shadow rounded-2xl p-8 text-center">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={`mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${
                            !passwordsMatch && 'border-red-500'
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleCredentialsSubmit}
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
            )}
        </div>
    );
};

export default RegistrationWorkflow;
