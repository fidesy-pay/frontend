// InvoiceDetails.tsx
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import {gql, useMutation, useQuery} from '@apollo/client';
import { formatDate } from '../../utils/format_date';

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
                        // FIXME data.invoices.items[0].amount
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

    // Placeholder URL for Polygon Matic logo
    const polygonMaticLogoUrl = 'https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo.png';

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Invoice Details</h1>
            <div key={invoice.id} className="bg-white p-4 rounded-md mb-4">
                <div className="text-sm text-gray-700">{invoice.id}</div>
                <div className="text-sm text-gray-700">{invoice.address}</div>
                <div className="text-sm text-gray-500">{invoice.usd_amount} USD / {invoice.token_amount} {invoice.token}</div>
                <div className="text-sm text-gray-500">Status: {invoice.status}</div>
                <div className="text-sm text-gray-500">Chain: {invoice.chain}</div>
                <div className="text-sm text-gray-500">Created At: {formatDate(invoice.created_at)}</div>
            </div>

            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-4">Payment Options</h2>
                <div className="flex items-center space-x-2">
                    <img src={polygonMaticLogoUrl} alt="Polygon Matic Logo" className="h-8 w-8" />
                    <span className="text-sm text-gray-700">{selectedPaymentOption}</span>
                </div>
            </div>

            <div className="mt-4">
                <button
                    onClick={handlePayment}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Pay with {selectedPaymentOption}
                </button>
            </div>
        </div>
    );
};

export default Invoice;
