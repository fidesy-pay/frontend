import { gql } from "@apollo/client";

export const BalancesQuery = gql`
    query Balances($filter: BalanceFilter!) {
        balance(filter: $filter) {
            balance
            usdBalance
        }
    }
`