import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { TransferMutation } from "../../graphql/mutation/transfer";
import { FeeQuery } from "../../graphql/query/fee";
import { ArbitrumEthereum, PolygonMatic } from "../Invoice/Invoice";
import {arbitrumLogoUrl, ethereumLogoUrl, polygonMaticLogoUrl} from "../../constants/constants"; // Assuming you have the payment options defined

type Fee = {
    usd_amount: number
    token_amount: number
}

const Transfer: React.FC = () => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [selectedChain, setSelectedChain] = useState(PolygonMatic);
    const [transferSuccess, setTransferSuccess] = useState(false);
    const [fee, setFee] = useState<Fee|null>(null);

    const { loading: feeLoading, error: feeError } = useQuery(FeeQuery, {
        variables: {
            filter: { chainEq: selectedChain.chain }
        },
        onCompleted: (data) => {
            setFee(data?.fee);
        }
    });

    const [transfer] = useMutation(TransferMutation);

    const handleTransfer = async () => {
        try {
            const transferInput = {
                receiver_address: receiverAddress,
                token_amount: parseFloat(transferAmount),
                chain: selectedChain.chain
            };

            const { data } = await transfer({
                variables: { input: transferInput }
            });

            if (data.transfer.hash) {
                setTransferSuccess(true);

                setTransferAmount("")
                setReceiverAddress("")
            }
        } catch (error) {
            console.error('Error transferring:', error);
        }
    };

    if (feeLoading) return <p>Loading...</p>;
    if (feeError) return <p>Error fetching fee: {feeError.message}</p>;

    return (
        <div className="mt-12 max-w-md w-full px-3 md:p-0">
            <h2 className="text-lg font-semibold">Transfer</h2>

            <div className="mt-2 md:mt-6 ring-2 ring-gray-100 custom-shadow py-9 px-6 rounded-3xl">
                <div className="flex">
                    <div className={"px-4 py-2 " + (selectedChain.symbol === "MATIC" ? "" : "opacity-25")}>
                        <div className="flex items-center space-x-2 text-gray-700"
                                 onClick={() => setSelectedChain(PolygonMatic)}>
                                <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                                <span className="text-sm">Polygon Matic</span>
                        </div>
                    </div>
                    <div className={"px-4 py-2 " + (selectedChain.symbol === "ETH" ? "" : "opacity-25")}>
                        <div className="flex items-center space-x-2 text-gray-700"
                             onClick={() => setSelectedChain(ArbitrumEthereum)}>
                            <img src={arbitrumLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                            <span className="text-sm">Arbitrum Ethereum</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="address">
                        Receiver address
                    </label>
                    <input type="text" id="address" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="amount">
                        Amount
                    </label>
                    <input type="number" id="amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
                </div>
                {fee && (
                    <div className="mt-5 flex items-center">
                        <label className="block text-gray-700 text-sm font-bold text-start">Fee:</label>
                        <div className="mx-2 flex items-center">
                            <span className="text-sm text-gray-600">{fee.token_amount}</span>
                            <div className="mx-3">
                                {selectedChain.symbol === "MATIC" ?
                                    <img src={polygonMaticLogoUrl} alt="Matic Logo" className="h-8 w-8" /> :
                                    <img src={ethereumLogoUrl} alt="Ethereum Logo" className="h-8 w-8" />
                                }
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <button onClick={handleTransfer} className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Transfer</button>
                </div>

                {transferSuccess && <p className="mt-5 text-center text-gray-600">Transfer completed </p>}
            </div>
        </div>
    );
};

export default Transfer;
