import {gql} from "@apollo/client";

export const ClientsQuery = gql`
    query Clients($filter: ClientsFilter, $page: Int!, $perPage: Int!) {
        clients(filter: $filter, page: $page, per_page: $perPage) {
            items {
                id
                username
                photo_url
            }
        }
    }
`;