import user_photo from '../../assets/user.png';
import {formatDateV2} from "../../utils/format_date";
import {useQuery} from "@apollo/client";
import {InvoicesQuery} from "../../graphql/query/invoices";
import { InvoiceModel } from "../../types/invoice";

export default function LastInvoices() {
    const { loading, error, data } = useQuery(InvoicesQuery, {
        variables: {},
    });


    if (loading) return <p className="text-center mt-4"></p>;

    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    return (
        <div className="mt-12 px-6 py-9 w-full max-w-md bg-white rounded rounded-3xl">
            <h1 className="text-lg mb-4 font-semibold">Last transactions</h1>
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
                <p className="font-bold text-xl ">+${input.invoice.usd_amount}</p>
            </div>
        </a>
)
}