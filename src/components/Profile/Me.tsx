import { useQuery } from "@apollo/client";

import {MeQuery} from "../../graphql/query/me";
import {useState} from "react";

export function Me() {

    const { loading, error, data } = useQuery(MeQuery)
    const [showApiKey, setShowApiKey] = useState(false);

    const toggleApiKeyVisibility = () => {
        setShowApiKey(!showApiKey);
    };

    if (loading) {
        return <div></div>
    }

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>

    return (
        <div className="mt-8 max-w-md">
            <h1 className="text-lg font-semibold mb-4">User Information</h1>
            <div className="bg-gradient-to-r from-blue-200 to-purple-200 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <div className="px-4 py-2">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <span>Username:</span>
                            <p className="font-semibold">{data.me.username}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <span>API Key:</span>
                            <p
                                className="font-semibold cursor-pointer"
                                onClick={toggleApiKeyVisibility}
                            >
                                {showApiKey ? data.me.api_key : '* '.repeat(data.me.api_key.length)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}