import {formatDate} from "../../utils/format_date";
import {useQuery} from "@apollo/client";
import {InvoicesQuery} from "../../graphql/query/invoices";

export function Invoices() {
    const { loading, error, data } = useQuery(InvoicesQuery, {
        variables: {},
    });

    if (loading) return <p className="text-center mt-4">Loading...</p>;

    if (error) {
        if (error.networkError?.message.includes("401")) {
            return <div></div>
        }

        return <p className="text-center text-red-500 mt-4">Error :(</p>
    }

    return (
        <div className="mt-8 w-full  max-w-md">
            <h2 className="text-lg font-semibold mb-4">Invoices</h2>
            {data.invoices.items && data.invoices.items.map((invoice: { id: string; address: string; token_amount: number; usd_amount: number; status: string; chain: string; created_at: string, token: string }) => (
                <div key={invoice.id} className="bg-gradient-to-r from-blue-200 to-purple-200 border border-gray-300 rounded-lg overflow-hidden shadow-lg w-full max-w-md mb-4">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold text-sm px-4 py-2">
                        {invoice.id}
                    </div>
                    <div className="px-4 py-2">
                        <div className="text-sm text-gray-700 mb-2">{invoice.address}</div>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>{invoice.usd_amount.toFixed(2)} USD</span>
                            <span>{invoice.token_amount.toFixed(18)} {invoice.token}</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">Status: {invoice.status}</div>
                        <div className="text-sm text-gray-500 mb-2">Chain: {invoice.chain}</div>
                        <div className="text-sm text-gray-500">Created At: {formatDate(invoice.created_at)}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}