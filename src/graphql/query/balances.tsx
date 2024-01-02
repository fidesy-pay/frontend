import { gql } from "@apollo/client";

export const BalancesQuery = gql`
    query Balances($filter: BalancesFilter!) {
        balances(filter: $filter) {
            balances
        }
    }
`