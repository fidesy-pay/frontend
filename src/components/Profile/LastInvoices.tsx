import user_photo from '../../assets/user.png';
import {formatDateV2} from "../../utils/format_date";
import {useQuery} from "@apollo/client";
import {InvoicesQuery} from "../../graphql/query/invoices";
import { InvoiceModel } from "../../types/invoice";
import {useState} from "react";

export default function LastInvoices() {
    const [invoiceStatuses, setInvoiceStatuses] = useState<string[]>(["SUCCESS"]);

    const { loading, error, data } = useQuery(InvoicesQuery, {
        variables: {
            filter: {
                statusIn: invoiceStatuses
            }
        },
    });


    if (loading) return <p className="text-center mt-4"></p>;

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    return (
        <div className="mt-12 px-6 py-9 w-full max-w-md bg-white rounded rounded-3xl">
            <div className="flex justify-between items-center">
                <h1 className={"text-lg mb-4 font-semibold p-4 rounded-2xl cursor-pointer " + (invoiceStatuses.includes("SUCCESS") ? "bg-base" : "")}
                    onClick={() => setInvoiceStatuses(["SUCCESS"])}
                    >
                    Last transactions
                </h1>

                <h1 className={"text-lg mb-4 font-semibold p-4 rounded-2xl cursor-pointer " + (invoiceStatuses.includes("NEW") || invoiceStatuses.includes("PENDING")   ? "bg-base" : "")}
                    onClick={() => setInvoiceStatuses(["NEW", "PENDING"])}
                    >
                    New invoices
                </h1>
            </div>
            <div className="">
                {data.invoices.items && data.invoices.items.map((invoice: InvoiceModel) => {
                    return <Invoice invoice={invoice}/>
                })}
            </div>
        </div>
    )
}

function Invoice(input:{invoice: InvoiceModel}) {
    return (
        <a className="mt-3 flex items-center cursor-pointer" href={"http://pay.fidesy.tech/invoices/"+input.invoice.id} target="_blank">
            <div className="">
                <img src={input.invoice.photo_url ? input.invoice.photo_url !== "" : user_photo} alt="User Photo" className="h-16 w-16 rounded-lg"/>
            </div>
            <div className="flex-grow flex flex-col px-6 py-4">
                <div className="font-bold text-lg mb-2">{input.invoice.name ? input.invoice.name !== "" : 'Anonymous'}</div>
                <p className="text-gray-600 text-xs mb-2">{formatDateV2(input.invoice.created_at)}</p>
            </div>
            <div className="">
                <p className="font-bold text-xl ">{input.invoice.status === "SUCCESS" ? "+" : ""}${input.invoice.usd_amount}</p>
            </div>
        </a>
)
}