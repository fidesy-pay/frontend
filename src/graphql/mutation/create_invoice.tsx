import {gql} from "@apollo/client";


export const CreateInvoiceMutation = gql`
    mutation CreateInvoiceMutation($input: CreateInvoiceInput!) {
        invoiceMutations {
            createInvoice(input: $input) {
                id
            }
        }
    }
`