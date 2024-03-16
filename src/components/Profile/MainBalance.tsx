import {useQuery} from "@apollo/client";
import {MainBalanceQuery} from "../../graphql/query/main_balance";


export function MainBalance() {
    const { loading, error, data } = useQuery(MainBalanceQuery, {
        variables: {},
    });

    if (error) return <p className="text-sm">Error getting balance :(</p>;

    return (
        <div className="mt-8 w-full max-w-md">
            <h1 className="text-lg mb-4 font-semibold">Overview</h1>
            <div className="flex flex-col items-center">
                <div>
                    <span className="text-sm">
                        Total balance
                    </span>
                </div>
                <div className="mt-2">
                    {loading ? <div className="text-sm text-gray-500">Loading...</div> : <span className="text-3xl font-semibold">${data.mainBalance.usdBalance.toFixed(2)}</span>}
                </div>
            </div>
        </div>
    )
}