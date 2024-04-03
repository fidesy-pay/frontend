import {gql} from "@apollo/client";


export const ConfirmEmailMutation = gql`
    mutation ConfirmEmail($input: ConfirmEmailInput!) {
        registrationMutations {
            confirmEmail(input: $input) {
                id
                state
                type
            }
        }
    }
`