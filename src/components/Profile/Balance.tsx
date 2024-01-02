import { useQuery } from "@apollo/client";
import {BalancesQuery} from "../../graphql/query/balances";

export function Balance(input: { address: string }) {
    const { loading, error, data } = useQuery(BalancesQuery, {
        variables: {
            filter: {
                addressIn: [input.address],
            },
        },
    });

    if (loading) {
        return <div className="text-sm text-gray-500">Loading...</div>
    }

    if (error) return <p className="text-sm">Error getting balance :(</p>;

    return <div className="text-sm text-gray-500">{data.balances && data.balances.balances[0]} MATIC</div>
}