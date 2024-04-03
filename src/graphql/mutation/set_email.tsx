import {gql} from "@apollo/client";


export const SetEmailMutation = gql`
    mutation SetEmail($input: SetEmailInput) {
        registrationMutations {
            setEmail(input: $input) {
                id
                state
                type
            }
        }
    }
`