import React, { useState } from 'react';
import user_photo from '../../assets/user.png';
import { formatDateV2 } from '../../utils/format_date';
import { useQuery } from '@apollo/client';
import { InvoicesQuery } from '../../graphql/query/invoices';
import { InvoiceModel } from '../../types/invoice';

export default function LastInvoices() {
    const [invoiceStatus, setInvoiceStatus] = useState<string>('SUCCESS');

    const { loading, error, data } = useQuery(InvoicesQuery, {
        variables: {
            filter: {
                statusIn: [invoiceStatus],
            },
        },
    });

    if (loading) return <p className="text-center mt-4"></p>;

    if (error) {
        if (error.networkError?.message.includes("401")) {
            return <div></div>
        }

        return <p className="text-center text-red-500 mt-4">Error :(</p>
    }

    return (
        <div className="mt-12 px-6 py-9 w-full max-w-md bg-white rounded rounded-3xl">
            <div className="flex justify-between items-center space-x-3">
                <h1 className='md:text-lg font-semibold mb-4'>
                    Transactions
                </h1>

                <select
                    className="text-sm md:text-lg mb-4 font-semibold p-4 rounded-2xl cursor-pointer bg-base"
                    value={invoiceStatus}
                    onChange={(e) => setInvoiceStatus(e.target.value)}>
                    <option value="SUCCESS">Success</option>
                    <option value="NEW">New</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="MANUAL_CONTROL">Manual Control</option>
                </select>
            </div>
            <div className="relative">
                {data.invoices.items &&
                    data.invoices.items.map((invoice: InvoiceModel) => {
                        return <Invoice key={invoice.id} invoice={invoice} />;
                    })}
            </div>
        </div>
    );
}

function Invoice({ invoice }: { invoice: InvoiceModel }) {
    return (
        <a className="md:mt-3 flex items-center cursor-pointer" href={"http://pay.fidesy.tech/invoices/"+invoice.id}>
            <div>
                <img src={invoice.payer && invoice.payer.photo_url !== "" ? invoice.payer.photo_url : user_photo} alt="User Photo" className="h-10 w-10 md:h-16 md:w-16 rounded-lg" />
            </div>
            <div className="flex-grow flex flex-col px-6 py-4">
                <div className="font-bold md:text-lg">{invoice.payer ? invoice.payer.username : 'Anonymous'}</div>
                <p className="text-gray-600 text-xs">{formatDateV2(invoice.created_at)}</p>
            </div>
            <div>
                <p className="font-bold md:text-xl ">{invoice.status === 'SUCCESS' ? '+' : ''}${invoice.usd_amount}</p>
            </div>
        </a>
    );
}
