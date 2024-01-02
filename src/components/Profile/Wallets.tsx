import {useQuery} from "@apollo/client";
import {WalletsQuery} from "../../graphql/query/wallets";
import { Balance } from "./Balance";


export function Wallets() {
    let clientID = localStorage.getItem("client_id")

    const { loading, error, data } = useQuery(WalletsQuery, {
        variables: {
            filter: {
                clientIdIn: [clientID],
            },
        },
    });

    // if (loading) {
    //     return (
    //         <div>
    //             <div className="skeleton" style={{ height: '50px', width: '100%', marginBottom: '10px' }}></div>
    //
    //             <p className="text-center mt-4">Loading...</p>
    //
    //             <div className="skeleton" style={{ height: '50px', width: '100%', marginBottom: '10px' }}></div>
    //         </div>
    //     );
    // }
    if (loading) return <div></div>

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Wallets</h2>
            {data.wallets.items && data.wallets.items.map((wallet: { address: string; balance: number }) => (
                <div key={wallet.address} className="bg-white p-4 rounded-md mb-4">
                    <div className="text-sm text-gray-700">{wallet.address}</div>
                    <Balance address={wallet.address}/>
                </div>
            ))}
        </div>
    )
}