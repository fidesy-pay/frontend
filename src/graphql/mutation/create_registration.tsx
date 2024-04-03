import {gql} from "@apollo/client";


export const CreateRegistrationMutation = gql`
    mutation CreateRegistration {
        registrationMutations {
            createRegistration {
                id
                state
                type
            }
        }
    }
`