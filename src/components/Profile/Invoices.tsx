import {formatDate} from "../../utils/format_date";
import {useQuery} from "@apollo/client";
import {InvoicesQuery} from "../../graphql/query/invoices";


export function Invoices() {
    const { loading, error, data } = useQuery(InvoicesQuery, {
        variables: {},
    });

    if (loading) return <p className="text-center mt-4">Loading...</p>;

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Invoices</h2>
            {data.invoices.items && data.invoices.items.map((invoice: { id: string; address: string; token_amount: number; usd_amount: number; status: string; chain: string; created_at: string, token: string }) => (
                <div key={invoice.id} className="bg-white p-4 rounded-md mb-4">
                    <div className="text-sm text-gray-700">{invoice.id}</div>
                    <div className="text-sm text-gray-700">{invoice.address}</div>
                    <div className="text-sm text-gray-500">{invoice.usd_amount} USD / {invoice.token_amount} {invoice.token}</div>
                    <div className="text-sm text-gray-500">Status: {invoice.status}</div>
                    <div className="text-sm text-gray-500">Chain: {invoice.chain}</div>
                    <div className="text-sm text-gray-500">Created At: {formatDate(invoice.created_at)}</div>
                </div>
            ))}
        </div>
    )
}