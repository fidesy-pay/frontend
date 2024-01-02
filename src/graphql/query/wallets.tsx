import {gql} from "@apollo/client";


export const WalletsQuery = gql`
    query Wallets($filter: WalletsFilter!) {
        wallets(filter: $filter) {
            items {
                address
                balance
            }
        }
    }
`