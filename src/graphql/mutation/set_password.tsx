import {gql} from "@apollo/client";


export const SetPasswordMutation = gql`
    mutation SetPassword($input: SetPasswordInput!) {
        restorePasswordMutations {
            setPassword(input: $input) {
                id
                state
            }
        }
    }
`