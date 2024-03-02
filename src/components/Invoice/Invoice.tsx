// InvoiceDetails.tsx
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import {gql, useMutation, useQuery} from '@apollo/client';
import { formatDate } from '../../utils/format_date';
import {polygonMaticLogoUrl} from "../../constants/constants";

const INVOICES_QUERY = gql`
    query Invoices($filter: InvoicesFilter!) {
        invoices(filter: $filter) {
            items {
                id
                usd_amount
                token_amount
                address
                status
                chain
                token
                created_at
            }
        }
    }
`;

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
const Invoice: React.FC = () => {
    const { invoice_id } = useParams<{ invoice_id: string }>();

    const { loading, error, data } = useQuery(INVOICES_QUERY, {
        variables: {
            filter: {
                idIn: [invoice_id],
            },
        },
    });

    const [selectedPaymentOption, setSelectedPaymentOption] = useState('Polygon Matic');

    const [updateInvoice] = useMutation(UPDATE_INVOICE_MUTATION);

    const handlePayment = async () => {
        try {
            // Send request to update the invoice
            await updateInvoice({
                variables: {
                    input: {
                        id: invoice_id,
                        chain: 'polygon',
                        token: 'matic-network',
                    },
                },
            });
            // Handle success or navigate to success page
            console.log('Invoice updated successfully!');
        } catch (error) {
            // Handle error
            console.error('Error updating invoice:', error);
        }
    };

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-4">Error :(</p>;

    const invoice = data.invoices.items[0];

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
                                <span className="text-sm text-gray-700">{invoice.usd_amount.toFixed(6)} USD / {invoice.token_amount.toFixed(6)} {invoice.token}</span>
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
                        <div className="flex items-center justify-center space-x-2 text-gray-700">
                            <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                            <span className="text-sm">Pay with {selectedPaymentOption}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    {invoice.status.toString() !== "SUCCESS" &&
                        <button
                            onClick={handlePayment}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Pay with {selectedPaymentOption}
                        </button>
                    }
                </div>
            </div>
        </div>

    )

};

export default Invoice;
