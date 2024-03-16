import { useQuery } from "@apollo/client";
import {BalancesQuery} from "../../graphql/query/balances";

export function Balance(input: { address: string, chain: string, token: string }) {
    const { loading, error, data } = useQuery(BalancesQuery, {
        variables: {
            filter: {
                addressEq: input.address,
                chainEq: input.chain,
                tokenEq: input.token,
            },
        },
    });

    if (loading) {
        return <div className="text-sm text-gray-500">Loading...</div>
    }

    if (error) return <p className="text-sm">Error getting balance :(</p>;

    return (
        <div className="flex flex-col items-center">
            <div className="md:text-lg font-bold">{data.balance && data.balance.balance.toFixed(6)}</div>
            <div className="text-sm text-gray-500">${data.balance && data.balance.usdBalance.toFixed(2)}</div>
        </div>
    )
}