import { useQuery } from "@apollo/client";
import { WalletsQuery } from "../../graphql/query/wallets";
import { Balance } from "./Balance";
import {
  ethereumLogoUrl,
  polygonMaticLogoUrl,
} from "../../constants/constants";
import React from "react";

export type Wallet = {
  address: string;
  chain: string;
};

export function Wallets() {
  const { loading, error, data } = useQuery(WalletsQuery, {
    variables: {},
  });

  if (loading) return <div></div>;

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
    <div className="mt-6 md:mt-12 max-w-md w-full">
      <h2 className="md:text-lg font-semibold mb-4 p-4">Balances</h2>
      <div className="ring-2 ring-gray-100 custom-shadow py-9 px-6 rounded-3xl">
        {data.wallets.items &&
          data.wallets.items
            .slice(0, 1)
            .map((wallet: Wallet) => <Wallet wallet={wallet} />)}
      </div>
    </div>
  );
}

function Wallet(input: { wallet: Wallet }) {
  return (
    <div key={input.wallet.address} className="rounded-lg">
      <div className="font-semibold text-sm px-4 py-2">
        {/*{input.wallet.address}*/}
      </div>
      <div className="md:px-4 md:py-2">
        <div className="flex items-center text-gray-700">
          <div>
            <span>
              {" "}
              <img
                src={polygonMaticLogoUrl}
                alt="Polygon Matic Logo"
                className="h-9 w-9 md:h-12 md:w-12"
              />
            </span>
          </div>
          <div className="flex-grow mx-3">
            <div>
              <span className="font-semibold md:text-xl">Matic</span>
            </div>
            <div>
              <span className="text-sm text-gray">polygon</span>
            </div>
          </div>
          <div className="">
            <Balance
              address={input.wallet.address}
              chain={"polygon"}
              token={"matic-network"}
            />
          </div>
        </div>
        <div className="mt-5 flex items-center text-gray-700">
          <div>
            <span>
              {" "}
              <img
                src={ethereumLogoUrl}
                alt="Polygon Matic Logo"
                className="h-9 w-9 md:h-12 md:w-12"
              />
            </span>
          </div>
          <div className="flex-grow mx-3">
            <div>
              <span className="font-semibold md:text-xl">Ethereum</span>
            </div>
            <div>
              <span className="text-sm text-gray">arbitrum</span>
            </div>
          </div>
          <div className="">
            <Balance
              address={input.wallet.address}
              chain={"arbitrum"}
              token={"ethereum"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
