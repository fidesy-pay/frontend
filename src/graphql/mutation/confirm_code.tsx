import { gql } from "@apollo/client";

export const ConfirmCodeMutation = gql`
    mutation ConfirmCode($input: ConfirmCodeInput!) {
        emailMutations {
            confirmCode(input: $input) {
                id
            }
        }
    }
`;