import {useQuery} from "@apollo/client";
import {WalletsQuery} from "../../graphql/query/wallets";
import { Balance } from "./Balance";
import {polygonMaticLogoUrl} from "../../constants/constants";
import React from "react";


export function Wallets() {
    const { loading, error, data } = useQuery(WalletsQuery, {
        variables: {},
    });

    if (loading) return <div></div>

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    return (
        <div className="mt-8 flex flex-col max-w-md">
            <h2 className="text-lg font-semibold mb-4">Wallets</h2>
            {data.wallets.items && data.wallets.items.map((wallet: { address: string; balance: number; chain: string }) => (
                <div key={wallet.address} className="bg-gradient-to-r from-blue-200 to-purple-200 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold text-sm px-4 py-2">
                        {wallet.address}
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex justify-between items-center text-gray-700">
                            <span> <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" /></span>
                            <Balance
                                address={wallet.address}
                                chain={wallet.chain}
                                token={"matic-network"}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}