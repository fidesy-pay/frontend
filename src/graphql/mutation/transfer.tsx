import { gql } from "@apollo/client";

export const TransferMutation = gql`
    mutation Transfer($input: TransferInput!) {
        transfer(input: $input) {
            hash
        }
    }
`;