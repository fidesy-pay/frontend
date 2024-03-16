import { gql } from "@apollo/client";

export const MainBalanceQuery = gql`
    query MainBalance {
        mainBalance {
            usdBalance
        }
    }
`