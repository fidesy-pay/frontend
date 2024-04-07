import {gql} from "@apollo/client";

export const MeQuery = gql`
    query Me {
        me {
            id
            username
            api_key
            created_at
            photo_url
            email
            is_invoice_notification_enabled
        }
    }`