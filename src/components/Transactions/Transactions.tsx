import { useQuery } from "@apollo/client"
import { TransactionsQuery } from "../../graphql/query/transactions"
import user_photo from "../../assets/user.png";
import { formatDate, formatDateV2 } from "../../utils/format_date";
import { ethereumLogoUrl, optimismLogoUrl, polygonMaticLogoUrl } from "../../constants/constants";



type TransactionModel = {
  id: string
  from_address: string
  to_address: string
  amount: number
  chain: string
  token: string
  created_at: string
  hash: string


  sender: ClientModel
  receiver: ClientModel

  is_client_sender: boolean
}

type ClientModel = {
  username: string
  photo_url: string
}

export const Transactions = () => {
  const { loading, error, data } = useQuery(TransactionsQuery, {
    variables: {
      page: 1,
      perPage: 10,
    }
  });

  if (loading) {
    return <div>Loading...</div>
  }

 
  if (loading) return <p className="text-center mt-4">Loading...</p>;

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
    <div className="mt-6">
        <h2 className="md:text-lg font-semibold mb-4 p-4">Transactions</h2>
        <div className="custom-shadow p-3 rounded-3xl">
          {data && data.transactions.items != null && data.transactions.items.map((tx: TransactionModel) => {
            return <Transaction tx={tx}/>
          })}
        </div>
    </div>
  )
}

const Transaction = ({tx}: {tx: TransactionModel}) => {
  return (
    <div className="mt-3 p-4">
      {tx.is_client_sender 
       ? <Client photo_url={tx.receiver.photo_url} username={tx.receiver.username} address={tx.to_address} created_at={tx.created_at} chain={tx.chain} amount={"-"+tx.amount.toString().slice(0, 8)} hash={tx.hash}/> 
       : <Client photo_url={tx.sender.photo_url} username={tx.sender.username} address={tx.from_address} created_at={tx.created_at} chain={tx.chain} amount={"+"+tx.amount.toString().slice(0, 8)} hash={tx.hash}/> 
       }    
    </div>
  )
}

type ClientProps = {
  photo_url: string
  username: string
  address: string
  created_at: string
  amount: string
  chain: string
  hash: string
}

const Client = ({ photo_url, username, address, created_at, chain, amount, hash }: ClientProps) => {

  let logo
  let scanLink

  switch (chain) {
    case "arbitrum":
      logo = ethereumLogoUrl
      scanLink = "https://sepolia.arbiscan.io/tx/"
      break
    case "optimism":
      logo = optimismLogoUrl
      scanLink = "https://sepolia-optimism.etherscan.io/tx/"
      break
    case "polygon":
      logo = polygonMaticLogoUrl
      scanLink = "https://www.oklink.com/amoy/tx/"
      break
  }

  scanLink += hash

  return (
    <a
    className="flex items-center cursor-pointer"
    href={scanLink}
    >
    <div>
      <img
        src={photo_url !== null ? photo_url : user_photo}
        alt="User"
        className="h-10 w-10 md:h-16 md:w-16 rounded-lg"
      />
    </div>
    <div className="flex-grow flex flex-col px-4 md:px-8">
      <div className="font-bold md:text-lg">
        {username ? username : address.slice(0, 8) + "..."}
      </div>
      <p className="text-gray-600 text-xs">
        {formatDateV2(created_at)}
      </p>
    </div>

    <div className="flex items-center">
        <span className="font-bold text-sm md:text-xl mr-2">{amount}</span>
        <span><img src={logo} alt="token" className="h-6 w-6 md:h-10 md:w-10 rounded-lg"/></span>
      </div>
    </a>
  )
}

