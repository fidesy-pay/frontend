import {gql} from "@apollo/client";
export const InvoicesQuery = gql`
    query Invoices($filter: InvoicesFilter, $page: Int!, $perPage: Int!) {
        invoices(filter: $filter, page: $page, per_page: $perPage) {
            items {
                id
                usd_amount
                token_amount
                address
                status
                chain
                token
                created_at
                payer {
                    username
                    photo_url
                }
            }
        }
    }
`;