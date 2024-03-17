import {useQuery} from "@apollo/client";
import {MeQuery} from "../../graphql/query/me";
import {useState} from "react";


export default function Profile() {

    const { loading, error, data } = useQuery(MeQuery)
    const [showApiKey, setShowApiKey] = useState(false);

    const toggleApiKeyVisibility = () => {
        setShowApiKey(!showApiKey);
    };

    if (loading) {
        return <div></div>
    }

    if (error) {
        if (error.networkError?.message.includes("401")) {
            return <div></div>
        }

        return <p className="text-center text-red-500 mt-4">Error :(</p>
    }

    return (
        <div className="p-6 mt-8 w-full max-w-md">
            <h1 className="text-lg mb-4 font-semibold">User information</h1>
                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center space-x-4 text-gray-700">
                            <span>Username</span>
                            <p className="font-semibold">{data.me.username}</p>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-700">
                            <span>API Key</span>
                            <p
                                className="font-semibold cursor-pointer"
                                onClick={toggleApiKeyVisibility}
                            >
                                {showApiKey ? data.me.api_key : '* '.repeat(data.me.api_key.length)}
                            </p>
                        </div>
            </div>
        </div>

    );
}