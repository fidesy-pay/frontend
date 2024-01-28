import {gql} from "@apollo/client";


export const WalletsQuery = gql`
    query Wallets {
        wallets {
            items {
                address
                chain
            }
        }
    }
`