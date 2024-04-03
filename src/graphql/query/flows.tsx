import {gql} from "@apollo/client";

export const FlowsQuery = gql`
    query Flows($filter: FlowsFilter) {
        flows(filter: $filter) {
            items {
                id
                type
                state
            }
        }
    }
`;