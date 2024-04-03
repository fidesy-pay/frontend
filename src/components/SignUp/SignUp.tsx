import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from "@apollo/client";
import {WalletsQuery} from "../../graphql/query/wallets";
import {FlowsQuery} from "../../graphql/query/flows";
import {LoginMutation} from "../../graphql/mutation/login";
import {CreateRegistrationMutation} from "../../graphql/mutation/create_registration";
import {SetEmailMutation} from "../../graphql/mutation/set_email";
import {ConfirmEmailMutation} from "../../graphql/mutation/confirm_email";
import {SetCredentialsMutation} from "../../graphql/mutation/set_registration_credentials";
import {useNavigate} from "react-router-dom";

const registrationIDName = "registration-id"

type Flow = {
    id: string
    type: string
    state: string
}
const RegistrationWorkflow = () => {
    const navigate = useNavigate();

    const [registrationID, setRegistrationID] = useState<string|null>("")
    const [flow, setFlow] = useState<Flow | null>(null);
    const [err, setErr] = useState("");

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            const response = await setEmailMutation({
                    variables: {
                        input: {
                            id: registrationID,
                            email: email,
                        }
                    },
                }
            );
        } catch (error) {
            console.error("Error during login:", error);
            setErr("An error occurred during login. Please try again later.");
            return ""
        }
    };

    const handleCodeSubmit = async () => {
        try {
            const response = await confirmEmailMutation({
                    variables: {
                        input: {
                            id: registrationID,
                            code: code,
                        }
                    },
                }
            );
        } catch (error) {
            console.error("Error during login:", error);
            setErr("An error occurred during login. Please try again later.");
            return ""
        }
    };

    const handleCredentialsSubmit = async () => {
        try {
            const response = await setCredentialsMutation({
                    variables: {
                        input: {
                            id: registrationID,
                            username: username,
                            password: password,
                        }
                    },
                }
            );

        } catch (error) {
            console.error("Error during login:", error);
            setErr("An error occurred during login. Please try again later.");
            return ""
        }
    };

    useEffect(() => {
        let regID = localStorage.getItem(registrationIDName)

        if (regID !== null && regID !== "") {
            setRegistrationID(regID)
            return
        }

        createRegistration().then(() => {})

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
        } catch (error) {
            console.error("Error during login:", error);
            setErr("An error occurred during login. Please try again later.");
            return ""
        }
    };

    return (
        <div className="mt-6 md:mt-12 max-w-md w-full">
            <div className="text-center">
                <span className="text-xl font-semibold">Registration</span>
            </div>

            {flow?.state === "WAITING_EMAIL" && (
                <div className="mt-10 custom-shadow rounded-xl p-8 text-center">
                    <input
                        type="email"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="font-bold border rounded p-2 px-5"
                        onClick={handleEmailSubmit}
                    >
                        Next
                    </button>
                </div>
            )}
            {flow?.state === "WAITING_EMAIL_CONFIRMATION" && (
                <div className="mt-10 custom-shadow rounded-2xl p-8 text-center">
                    <input
                        type="text"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        placeholder="Confirmation Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                        className="font-bold border rounded p-2 px-5"
                        onClick={handleCodeSubmit}
                    >
                        Next
                    </button>
                </div>
            )}
            {flow?.state === "WAITING_CREDENTIALS" && (
                <div className="mt-10 custom-shadow rounded-2xl p-8 text-center">
                    <input
                        type="text"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="font-bold border rounded p-2 px-5"
                        onClick={handleCredentialsSubmit}
                    >
                        Sign Up
                    </button>
                </div>
            )}
        </div>
    );
};

export default RegistrationWorkflow;