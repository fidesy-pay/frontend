import { useQuery } from "@apollo/client";
import { BalancesQuery } from "../../graphql/query/balances";

export function Balance(input: {
  address: string;
  chain: string;
  token: string;
}) {
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
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    if (
      error.networkError?.message.includes("401") ||
      error.toString().includes("NO_AUTH")
    ) {
      return <div></div>;
    }
    return <p className="text-center text-red-500 mt-4">Error :(</p>;
  }

  return (
    <div className="flex items-center">
      <div className="md:text-md ">
        {data.balance && data.balance.balance.toFixed(6)}
      </div>
      <div className="mx-2 text-sm text-gray-500">
        ${data.balance && data.balance.usdBalance.toFixed(2)}
      </div>
    </div>
  );
}
