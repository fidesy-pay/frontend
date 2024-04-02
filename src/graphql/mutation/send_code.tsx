import { gql } from "@apollo/client";

export const SendCodeMutation = gql`
    mutation SendCode($input: SendCodeInput!) {
        emailMutations {
            sendCode(input: $input) {
                id
            }
        }
    }
`;