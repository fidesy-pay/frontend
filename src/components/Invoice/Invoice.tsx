// InvoiceDetails.tsx
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {gql, useMutation, useQuery} from '@apollo/client';
import {formatDate} from '../../utils/format_date';
import {arbitrumLogoUrl, polygonMaticLogoUrl} from "../../constants/constants";
import { InvoiceModel } from "../../types/invoice";
import {UpdateInvoiceMutation} from "../../graphql/mutation/update_invoice";
import Header from "../Header/Header";

type PaymentOption = {
    name: string
    chain: string
    token: string
    symbol: string
    image: string
}

const paymentNotAvailableStatuses = [
    "SUCCESS",
    "FAILED",
    "MANUAL_CONTROL"
]

export const PolygonMatic: PaymentOption = {name: "Polygon Matic", chain: "polygon", token: "matic-network", symbol: "MATIC", image: polygonMaticLogoUrl};
export const ArbitrumEthereum: PaymentOption = {name: "Arbitrum Ethereum", chain: "arbitrum", token: "ethereum", symbol: "ETH", image: arbitrumLogoUrl};

export const Invoice: React.FC = () => {
    const { invoice_id } = useParams<{ invoice_id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState<InvoiceModel | null>(null);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<PaymentOption | null>(PolygonMatic);

    const [updateInvoice] = useMutation(UpdateInvoiceMutation);

    const fetchInvoice = async () => {
        try {
            const response = await fetch(`http://facade.pay.fidesy.tech/api/invoice/${invoice_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch invoice');
            }
            const invoiceResp: InvoiceModel = await response.json();
            setInvoice(invoiceResp);
            setLoading(false);
        } catch (error: any) {
            setError(error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchInvoice();
    }, [invoice_id]);

    const handlePayment = async () => {
        try {
            // Send request to update the invoice
            await updateInvoice({
                variables: {
                    input: {
                        id: invoice_id,
                        chain: selectedPaymentOption?.chain,
                        token: selectedPaymentOption?.token,
                    },
                },
            });
            // Handle success or navigate to success page
            console.log('Invoice updated successfully!');
            fetchInvoice()
        } catch (error) {
            // Handle error
            console.error('Error updating invoice:', error);
        }
    };

    if (loading) return <p></p>;
    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    if (!invoice) {
        return <p className="text-center mt-4">Invoice not found</p>;
    }
    return (
        <section>
            <Header/>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                <h1 className="text-2xl font-semibold mb-6 text-center">Invoice Details</h1>
                <div key={invoice.id} className="mb-6 rounded-lg shadow-lg">
                    <div className="p-4">
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600 mr-5">ID:</span>
                                <span className="text-sm text-gray-700 break-all">{invoice.id}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600 mr-3">Address:</span>
                                <span className="text-sm text-gray-700 break-all">{invoice.address}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600">Amount:</span>
                                <span className="text-sm text-gray-700">${invoice.usd_amount.toFixed(2)} <br/> {invoice.token_amount != undefined && invoice.token_amount.toFixed(18)} {invoice.token}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                <span className="text-sm text-gray-700">{invoice.status}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600">Chain:</span>
                                <span className="text-sm text-gray-700">{invoice.chain}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-600">Created At:</span>
                                <span className="text-sm text-gray-700">{formatDate(invoice.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!paymentNotAvailableStatuses.includes(invoice.status.toString()) &&
                    <div>
                        <div className="mt-6 rounded-lg">
                            <div className="font-semibold text-sm px-4 py-2">
                                Payment Options
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <div className="flex items-center space-x-2 text-gray-700"
                                 onClick={() => setSelectedPaymentOption(PolygonMatic)}>
                                <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                                <span className="text-sm">Polygon Matic</span>
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <div className="flex items-center space-x-2 text-gray-700"
                                 onClick={() => setSelectedPaymentOption(ArbitrumEthereum)}>
                                <img src={arbitrumLogoUrl} alt="Arbitrum Logo" className="h-8 w-8" />
                                <span className="text-sm">Arbitrum Ethereum</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handlePayment}
                                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Pay with {selectedPaymentOption?.name}
                            </button>
                        </div>
                    </div>
                }
            </div>
        </section>
    )

};

export default Invoice;
