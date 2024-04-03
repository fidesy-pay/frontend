import {gql} from "@apollo/client";


export const SetCredentialsMutation = gql`
    mutation SetCredentials($input: SetCredentialsInput!) {
        registrationMutations {
            setCredentials(input: $input) {
                id
                state
                type
            }
        }
    }
`