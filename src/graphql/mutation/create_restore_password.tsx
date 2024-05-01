import { gql } from "@apollo/client";

export const CreateRestorePasswordMutation = gql`
    mutation CreateRestorePassword($input: CreateRestorePasswordInput!) {
        restorePasswordMutations {
            createRestorePassword(input: $input) {
                id
                state
            }
        }
    }
`;