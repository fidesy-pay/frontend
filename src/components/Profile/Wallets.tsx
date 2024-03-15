import {useQuery} from "@apollo/client";
import {WalletsQuery} from "../../graphql/query/wallets";
import { Balance } from "./Balance";
import {arbitrumLogoUrl, ethereumLogoUrl, polygonMaticLogoUrl} from "../../constants/constants";
import React from "react";


type Wallet = {
    address: string
}

export function Wallets() {
    const { loading, error, data } = useQuery(WalletsQuery, {
        variables: {},
    });

    if (loading) return <div></div>

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    return (
        <div className="mt-12 max-w-md w-full bg-white py-9 px-6 rounded-3xl">
            <h2 className="text-lg font-semibold mb-4">Balances</h2>
            {data.wallets.items && data.wallets.items.slice(0, 1).map((wallet: Wallet) => (
                <Wallet wallet={wallet}/>
            ))}
        </div>
    )
}

function Wallet(input: {wallet: Wallet}) {
    return (
        <div key={input.wallet.address} className="rounded-lg">
            <div className="font-semibold text-sm px-4 py-2">
                {/*{input.wallet.address}*/}
            </div>
            <div className="px-4 py-2">
                <div className="flex items-center text-gray-700">
                    <div>
                        <span> <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-12 w-12"/></span>
                    </div>
                    <div className="flex-grow mx-3">
                        <div>
                            <span className="font-semibold text-xl">Matic</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray">polygon</span>
                        </div>
                    </div>
                    <div className="">
                        <Balance
                            address={input.wallet.address}
                            chain={"polygon"}
                            token={"matic"}
                        />
                    </div>
                </div>
                <div className="mt-5 flex items-center text-gray-700">
                    <div>
                        <span> <img src={ethereumLogoUrl} alt="Polygon Matic Logo" className="h-12 w-12"/></span>
                    </div>
                    <div className="flex-grow mx-3">
                        <div>
                            <span className="font-semibold text-xl">Ethereum</span>
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
    )
}