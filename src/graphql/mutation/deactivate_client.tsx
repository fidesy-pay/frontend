import { gql } from "@apollo/client";

export const DeactivateClient = gql`
    mutation ClientMutations {
        clientMutations {
            deactivate {
                id
            }
        }
    }
`;
