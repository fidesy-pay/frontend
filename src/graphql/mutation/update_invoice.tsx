import {gql} from "@apollo/client";


export const UpdateInvoiceMutation = gql`
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