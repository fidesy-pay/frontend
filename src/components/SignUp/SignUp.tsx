import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { LoginMutation } from "../../graphql/mutation/login";
import { SendCodeMutation } from "../../graphql/mutation/send_code";
import { SignUpMutation } from '../../graphql/mutation/signup';


Modal.setAppElement('#root');

const RegistrationWorkflow: React.FC = () => {
    const navigate = useNavigate();


    const [errors, setErrors] = useState<string[]>([]);
    const [showOTP, setShowOTP] = useState(false);

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailCodeId, setEmailCodeId] = useState('');

    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const [sendCodeMutation] = useMutation(SendCodeMutation);
    const [signUpMutation] = useMutation(SignUpMutation);
    const [loginMutation] = useMutation(LoginMutation);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);

        try {
            setLoading(true);

            const sendCodeResponse = await sendCodeMutation({
                variables: { input: { email } },
            });
            setEmailCodeId(sendCodeResponse.data.sendEmailOtp.email_code_id);

            setShowOTP(true);
        } catch (error: any) {
            setErrors([error.message]);
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);

        try {
            setOtpLoading(true);

            const signUpResponse = await signUpMutation({
                variables: {
                    input: {
                        email_code_id: emailCodeId,
                        email_code: code,
                        username,
                        password,
                        email
                    }
                }
            });

            if (signUpResponse.data.signUp.success) {
                const loginResp = await loginMutation({
                    variables: { input: { username, password } },
                });

                if (loginResp.data.login.token) {
                    localStorage.setItem("token", loginResp.data.login.token);
                    navigate("/overview");
                }
            } else {
                setErrors([signUpResponse.data.signUp.message]);
            }
        } catch (error: any) {
            setErrors([error.message]);
        } finally {
            setOtpLoading(false);
            setLoading(false);
        }
    };

    const passwordsMatch = password === confirmPassword;

    return (
        <section>
            <div className="mt-32 w-full flex flex-col items-center">
                <div className="mt-6 md:mt-12 p-4 max-w-md w-full">
                    <div className="text-center">
                        <span className="text-xl font-semibold">Registration</span>
                    </div>

                    <div className="mt-10 custom-shadow rounded-xl p-8 text-center">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email" className="block mb-2 text-sm text-left font-medium text-gray-900">Your email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="email@example.com"
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                                required
                            />
                            <label htmlFor="username" className="mt-4 block mb-2 text-sm text-left font-medium text-gray-900">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="example"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="password" className="mt-4 block mb-2 text-sm text-left font-medium text-gray-900">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="confirmPassword" className="mt-4 block mb-2 text-sm text-left font-medium text-gray-900">Confirm password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="******"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                className="mt-6 bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={loading || !passwordsMatch}
                            >
                                {loading ? 'Loading...' : 'Sign Up'}
                            </button>
                            {!passwordsMatch && (
                                <p className="text-red-500 mt-2">Passwords do not match</p>
                            )}
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-500 mt-2">{error}</p>
                            ))}
                        </form>
                    </div>

                    <Modal
                        isOpen={showOTP}
                        onRequestClose={() => setShowOTP(false)}
                        contentLabel="OTP Confirmation"
                        className="custom-modal"
                        overlayClassName="custom-overlay"
                    >
                        <div className="p-8 text-center">
                            <h2 className="text-xl font-semibold">Enter Confirmation Code</h2>
                            <form onSubmit={handleOTPSubmit}>
                                <label htmlFor="code" className="block mb-2 text-sm text-left font-medium text-gray-900">Confirmation code</label>
                                <input
                                    type="text"
                                    id="code"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="111111"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                                <button
                                    className="mt-4 bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={otpLoading}
                                >
                                    {otpLoading ? 'Loading...' : 'Confirm'}
                                </button>
                            </form>
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-500 mt-2">{error}</p>
                            ))}
                        </div>
                    </Modal>
                </div>
            </div>
        </section>
    );
};

export default RegistrationWorkflow;
