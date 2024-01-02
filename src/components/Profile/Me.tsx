import { useQuery } from "@apollo/client";

import {MeQuery} from "../../graphql/query/me";

export function Me() {

    const { loading, error, data } = useQuery(MeQuery)

    if (loading) {
        return <div></div>
    }

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">User Information</h1>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Username:</span>
                    <p className="font-semibold">{data.me.username}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">API Key:</span>
                    <p className="font-semibold">{data.me.api_key}</p>
                </div>
            </div>
        </div>
    );
}