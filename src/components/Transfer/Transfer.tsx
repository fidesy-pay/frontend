import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { TransferMutation } from "../../graphql/mutation/transfer";
import { FeeQuery } from "../../graphql/query/fee";
import { ClientsQuery } from "../../graphql/query/clients"; // Import the ClientsQuery
import { ArbitrumEthereum, OptimismEthereum, PolygonMatic } from "../Invoice/Invoice";
import {
  arbitrumLogoUrl,
  ethereumLogoUrl,
  optimismLogoUrl,
  polygonMaticLogoUrl,
} from "../../constants/constants";
import user_photo from "../../assets/user.png";
import { formatDateV2 } from "../../utils/format_date";
import Client from "../Client/Client";
import { directive } from "@babel/types";
import Header from "../Header/Header";
import { Balance } from "../Balance/Balance";
import { WalletsQuery } from "../../graphql/query/wallets";
import { Wallet } from "../Overview/Wallets";
import { Error } from "../Error/Error"

type Fee = {
  usd_amount: number;
  token_amount: number;
};

type User = {
  id: string;
  username: string;
  photo_url: string;
};

type TransferInput = {
  receiver_address: string;
  receiver_client_id: string;
  token_amount: number;
  chain: string;
  gas_limit: number;
};

const Transfer: React.FC = () => {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [gasLimit, setGasLimit] = useState<number>(21000);
  const [selectedChain, setSelectedChain] = useState(PolygonMatic);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [fee, setFee] = useState<Fee | null>(null);
  const [userList, setUserList] = useState<any[]>([]); // State to store fetched users
  const [fetchingUsers, setFetchingUsers] = useState(false); // State to track fetching status
  const [user, setUser] = useState<User | null>(null);
  const [transferError, setTransferError] = useState<string>("");

  const { loading: feeLoading, error: feeError } = useQuery(FeeQuery, {
    variables: {
      filter: {
        chainEq: selectedChain.chain,
        gasLimit: gasLimit,
      },
    },
    onCompleted: (data) => {
      setFee(data?.fee);
    },
  });

  const { data: walletsResp } = useQuery(WalletsQuery, {
    variables: {},
  });


  const { loading: clientsLoading, error: clientsError } = useQuery(
    ClientsQuery,
    {
      skip: receiverAddress.length < 3, // Skip query if receiver address length is less than 3
      variables: {
        filter: { username_in: [receiverAddress] },
        page: 1,
        perPage: 10, // Limit the number of results
      },
      onCompleted: (data) => {
        setUserList(data?.clients?.items || []);
        setFetchingUsers(false);
      },
    },
  );
  const [transfer] = useMutation(TransferMutation);

  if (feeError) {
    if (
      feeError.networkError?.message.includes("401") ||
      feeError.toString().includes("NO_AUTH")
    ) {
      return <div></div>;
    }

    // return <p className="text-center text-red-500 mt-4">Error :(</p>;
  }

  const handleGasLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    if (isNaN(value)) {
      return;
    }

    setGasLimit(value);
  };

  const handleTransferError = (errorMessage: string) => {
    if (errorMessage.includes("maxFeePerGas") || errorMessage.includes("intrinsic gas too low")) {
      setTransferError("Increase transfer fee")
      return
    }

    if (errorMessage.includes("insufficient funds")) {
      setTransferError("Not enough funds to transfer")
      return
    }

    setTransferError(errorMessage)
  }

  const handleTransfer = async () => {
    try {
      setTransferError("");

      let feeValue = 0;
      if (fee) {
        feeValue = fee.token_amount;
      }

      const transferInput: TransferInput = {
        receiver_address: "",
        receiver_client_id: "",
        token_amount: parseFloat(transferAmount) + feeValue,
        chain: selectedChain.chain,
        gas_limit: gasLimit,
      };

      if (user) {
        transferInput.receiver_client_id = user.id;
      } else {
        transferInput.receiver_address = receiverAddress;
      }

      const { data } = await transfer({
        variables: { input: transferInput },
      });

      if (data.transfer.hash) {
        setTransferSuccess(true);
        setTransferAmount("");
        setTransferError("");
        setReceiverAddress("");
      }
    } catch (error: any) {
      console.error("Error transferring:", error);
      handleTransferError(error.toString())
    }
  };

  return (
    <div>
      <Header />
      <div className="mt-12 flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">

        <div className="max-w-md w-full px-3 md:p-0">
          <h2 className="text-lg font-semibold">Transfer</h2>

          <div className="mt-2 md:mt-6 ring-2 ring-gray-100 custom-shadow py-9 px-6 rounded-3xl">
            <div className="flex">
              <div
                className={
                  "px-4 py-2 " +
                  (selectedChain.symbol === "MATIC" ? "" : "opacity-25")
                }
              >
                <div
                  className="flex items-center space-x-2 text-gray-700"
                  onClick={() => setSelectedChain(PolygonMatic)}
                >
                  <img
                    src={polygonMaticLogoUrl}
                    alt="Polygon Matic Logo"
                    className="h-8 w-8"
                  />
                  <span className="text-sm">Polygon Matic</span>
                </div>
              </div>
              <div
                className={
                  "px-4 py-2 " +
                  (selectedChain.chain === "arbitrum" ? "" : "opacity-25")
                }
              >
                <div
                  className="flex items-center space-x-2 text-gray-700"
                  onClick={() => setSelectedChain(ArbitrumEthereum)}
                >
                  <img
                    src={arbitrumLogoUrl}
                    alt="Polygon Matic Logo"
                    className="h-8 w-8"
                  />
                  <span className="text-sm">Arbitrum Ethereum</span>
                </div>
              </div>
              <div
                className={
                  "px-4 py-2 " +
                  (selectedChain.chain === "optimism" ? "" : "opacity-25")
                }
              >
                <div
                  className="flex items-center space-x-2 text-gray-700"
                  onClick={() => setSelectedChain(OptimismEthereum)}
                >
                  <img
                    src={optimismLogoUrl}
                    alt="Optimism ETH Logo"
                    className="h-8 w-8"
                  />
                  <span className="text-sm">Optimism ETH</span>
                </div>
              </div>
              
            </div>

            <div className="mt-6 mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-start"
                htmlFor="address"
              >
                Receiver address/username
              </label>
              {!user && (
                <input
                  type="text"
                  id="address"
                  value={receiverAddress}
                  onChange={(e) => {
                    setReceiverAddress(e.target.value);
                    setFetchingUsers(true); // Start fetching users when typing
                  }}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              )}
              {user && (
                <Client username={user.username} photo_url={user.photo_url} />
              )}

              {fetchingUsers && <p>Loading users...</p>}
              {userList.length > 0 && (
                <div className="absolute bg-white w-full max-w-md mt-1 rounded-md border border-gray-300 z-10">
                  {userList.map((u: any) => (
                    <div
                      key={u.id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setUser(u);
                        setReceiverAddress(u.id);
                      }}
                    >
                      <Client username={u.username} photo_url={u.photo_url} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-start"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

            </div>

            <div className="flex flex-start items-center">
              <div>
                <span className="text-sm font-semibold">Balance:</span>
              </div>
              <div className="mx-2">
                {walletsResp !== undefined && <Balance 
                  address={walletsResp.wallets.items.filter((wallet: Wallet) => wallet.chain===selectedChain.chain)[0].address} 
                  chain={selectedChain.chain} 
                  token={selectedChain.token}
                  />}
              </div>
            </div>

          
            <div className="mt-4 mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-start"
                htmlFor="gas_limit"
              >
                Gas limit (optional)
              </label>
              <input
                type="number"
                id="gas_limit"
                value={gasLimit}
                onChange={(e) => handleGasLimitChange(e)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {feeLoading && <p>Loading...</p>}
            {feeError && (
              <p className="text-center text-red-500 mt-4">
                Error fetching fee
              </p>
            )}
            {fee && (
              <div>
                <div className="mt-5 flex items-center">
                  <label className="block text-gray-700 text-sm font-bold text-start">
                    Fee:
                  </label>
                  <div className="mx-2 flex items-center">
                    <span className="text-sm text-gray-600">
                      {fee.token_amount}
                    </span>
                    <div className="mx-3">
                      {selectedChain.symbol === "MATIC" ? (
                        <img
                          src={polygonMaticLogoUrl}
                          alt="Matic Logo"
                          className="h-8 w-8"
                        />
                      ) : (
                        <img
                          src={ethereumLogoUrl}
                          alt="Ethereum Logo"
                          className="h-8 w-8"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center">
                  <label className="block text-gray-700 text-sm font-bold text-start">
                    Amount with fee:
                  </label>
                  <div className="mx-2 flex items-center">
                    <span className="text-sm text-gray-600">
                      {transferAmount != ""
                        ? fee.token_amount + parseFloat(transferAmount)
                        : fee.token_amount}
                    </span>
                    <div className="mx-3">
                      {selectedChain.symbol === "MATIC" ? (
                        <img
                          src={polygonMaticLogoUrl}
                          alt="Matic Logo"
                          className="h-8 w-8"
                        />
                      ) : (
                        <img
                          src={ethereumLogoUrl}
                          alt="Ethereum Logo"
                          className="h-8 w-8"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 text-center">
              <button
                onClick={handleTransfer}
                className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Transfer
              </button>
            </div>

            {transferSuccess && (
              <p className="mt-5 text-center text-gray-600">
                Transfer completed{" "}
              </p>
            )}
            {transferError && (
              <Error message={transferError}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
