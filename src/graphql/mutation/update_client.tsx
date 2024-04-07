import { gql } from "@apollo/client";

export const UpdateClientMutation = gql`
    mutation UpdateClient($input: UpdateClientInput!) {
        clientMutations {
            updateClient(input: $input) {
                id
                is_invoice_notification_enabled
            }
        }
    }
`;