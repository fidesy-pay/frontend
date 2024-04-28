import { useQuery } from "@apollo/client";
import { MainBalanceQuery } from "../../graphql/query/main_balance";

export function MainBalance() {
  const { loading, error, data } = useQuery(MainBalanceQuery, {
    variables: {},
  });

  if (error) {
    if (error.networkError?.message.includes("401")) {
      return <div></div>;
    }

    return <p className="text-center text-red-500 mt-4">Error :(</p>;
  }

  return (
    <div className="mt-32 w-full max-w-md">
      <div className="flex flex-col items-center">
        <div>
          <span className="text-sm">Total balance</span>
        </div>
        <div className="mt-2">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <span className="text-3xl font-semibold">
              ${data.mainBalance.usdBalance.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
