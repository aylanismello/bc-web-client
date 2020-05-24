import { useApolloClient, gql, useQuery } from "@apollo/client";

function useCollectionsQuery(options = { fetchPolicy: "" }) {
  const { fetchPolicy } = options;

  const COLLECTIONS_STR = `
    {
      collections ${fetchPolicy ? "" : "@client"} {
        name
        artwork_url
        collection_num
        collection_type
        created_at
        description
        id
        sanity_id
        updated_at
        updated_at_sanity
        weekly_id
        tracklist {
          name
        }
      }
    }
  `;

  // tracklist: null;

  const COLLECTIONS = gql`
    ${COLLECTIONS_STR}
  `;

  const { data, loading, error } = useQuery(COLLECTIONS, {
    fetchPolicy: "network-only",
  });

  // console.log(`query: ${COLLECTIONS_STR}`);

  return { data, loading, error };
}

export default useCollectionsQuery;
