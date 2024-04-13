import { gql } from "@apollo/client";

export const RegenerateAPIKey = gql`
  mutation ClientMutations {
    clientMutations {
      regenerateAPIKey {
        id
      }
    }
  }
`;
