import {gql} from "@apollo/client";

export const FeeQuery = gql`
    query Fee($filter: FeeFilter) {
        fee(filter: $filter) {
            usd_amount
            token_amount
        }
    }
`;