// InvoiceDetails.tsx
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {gql, useMutation, useQuery} from '@apollo/client';
import {formatDate} from '../../utils/format_date';
import {arbitrumLogoUrl, polygonMaticLogoUrl} from "../../constants/constants";

type Invoice = {
    id: string;
    client_id: string;
    usd_amount: number;
    token_amount: number;
    chain: string;
    token: string;
    status: number;
    address: string;
    created_at: string;
};

const UPDATE_INVOICE_MUTATION = gql`
    mutation UpdateInvoice($input: UpdateInvoiceInput!) {
        invoiceMutations {
            updateInvoice(input: $input) {
                invoice {
                    address
                    usd_amount
                    token_amount
                    chain
                    created_at
                    id
                    status
                    token
                }
            }
        }
    }
`

type PaymentOption = {
    name: string
    chain: string
    token: string
}

const PolygonMatic: PaymentOption = {name: "Polygon Matic", chain: "polygon", token: "matic-network"};
const ArbitrumEthereum: PaymentOption = {name: "Arbitrum Ethereum", chain: "arbitrum", token: "ethereum"};

const Invoice: React.FC = () => {
    const { invoice_id } = useParams<{ invoice_id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<PaymentOption | null>(PolygonMatic);

    const [updateInvoice] = useMutation(UPDATE_INVOICE_MUTATION);

    const fetchInvoice = async () => {
        try {
            const response = await fetch(`http://77.91.123.23:7090/api/invoice/${invoice_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch invoice');
            }
            const invoiceResp: Invoice= await response.json();
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

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    if (!invoice) {
        return <p className="text-center mt-4">Invoice not found</p>;
    }
    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="p-8 rounded-lg max-w-xl">
                <h1 className="text-2xl font-semibold mb-6 text-center">Invoice Details</h1>
                <div key={invoice.id} className="mb-6 bg-gradient-to-r from-blue-200 to-purple-200 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold text-sm px-4 py-2">
                        Invoice Information
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600">Invoice ID:</span>
                                <span className="text-sm text-gray-700">{invoice.id}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600">Address:</span>
                                <span className="text-sm text-gray-700 break-all">{invoice.address}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-300 py-2">
                                <span className="text-sm font-medium text-gray-600">Amount:</span>
                                <span className="text-sm text-gray-700">{invoice.usd_amount.toFixed(9)} USD / {invoice.token_amount != undefined && invoice.token_amount.toFixed(9)} {invoice.token}</span>
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

                <div className="mt-6 text-center bg-gradient-to-r from-blue-200 to-purple-200 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold text-sm px-4 py-2">
                        Payment Options
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-center space-x-2 text-gray-700"
                            onClick={() => setSelectedPaymentOption(PolygonMatic)}>
                            <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                            <span className="text-sm">Pay with Polygon Matic</span>
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-center space-x-2 text-gray-700"
                             onClick={() => setSelectedPaymentOption(ArbitrumEthereum)}>
                            <img src={arbitrumLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                            <span className="text-sm">Pay with Arbitrum Ethereum</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    {invoice.status.toString() !== "SUCCESS" &&
                        <button
                            onClick={handlePayment}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Pay with {selectedPaymentOption?.name}
                        </button>
                    }
                </div>
            </div>
        </div>

    )

};

export default Invoice;
