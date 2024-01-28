import {gql} from "@apollo/client";
export const InvoicesQuery = gql`
    query Invoices($filter: InvoicesFilter) {
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