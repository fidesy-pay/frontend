import { gql } from "@apollo/client";

export const SendCodeMutation = gql`
    mutation SendCode($input: SendEmailOtpInput!) {
        sendEmailOtp(input: $input) {
                email_code_id
        }
    }
`;