import {gql} from "@apollo/client";


export const TransactionsQuery = gql`
    query Transactions($page: Int!, $perPage: Int!) {
        transactions(page: $page, per_page: $perPage) {
            items {
                id
                to_address
                from_address
                amount
                chain
                token
                created_at
                hash

                sender {
                    username
                    photo_url
                }

                receiver {
                    username
                    photo_url
                }

                is_client_sender
            }
        }
    }
`