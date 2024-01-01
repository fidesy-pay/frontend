import {gql, useQuery} from "@apollo/client";


const ME = gql`
    query Me {
        me {
            id
            username
            api_key
            created_at
            wallets {
                address
                balance
            }
            invoices {
                id
                address
                amount
                chain
                token
                status
                created_at
            }
        }
    }`

export default function Profile() {

    const { loading, error, data } = useQuery(ME, )

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;


    const formatInvoiceDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            timeStyle: 'short',
            dateStyle: 'medium',
        }).format(date);
    };

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">User Information</h1>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Username:</span>
                    <p className="font-semibold">{data.me.username}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">API Key:</span>
                    <p className="font-semibold">{data.me.api_key}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Wallets</h2>
                {data.me.wallets.map((wallet: { address: string; balance: number }) => (
                    <div key={wallet.address} className="bg-white p-4 rounded-md mb-4">
                        <div className="text-sm text-gray-700">{wallet.address}</div>
                        <div className="text-sm text-gray-500">{wallet.balance} MATIC</div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Invoices</h2>
                {data.me.invoices.map((invoice: { id: string; address: string; amount: number; status: string; chain: string; created_at: string, token: string }) => (
                    <div key={invoice.id} className="bg-white p-4 rounded-md mb-4">
                        <div className="text-sm text-gray-700">{invoice.id}</div>
                        <div className="text-sm text-gray-700">{invoice.address}</div>
                        <div className="text-sm text-gray-500">Amount: {invoice.amount} {invoice.token}</div>
                        <div className="text-sm text-gray-500">Status: {invoice.status}</div>
                        <div className="text-sm text-gray-500">Chain: {invoice.chain}</div>
                        <div className="text-sm text-gray-500">Created At: {formatInvoiceDate(invoice.created_at)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}