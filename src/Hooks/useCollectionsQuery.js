import { useApolloClient, gql, useQuery } from "@apollo/client";

function useCollectionsQuery(options = { fetchPolicy: ''}) {
  const { fetchPolicy } = options;
  
  const COLLECTIONS_STR = `
    {
      collections ${fetchPolicy ? "" : "@client"} {
        name
      }
    }
  `;

  const COLLECTIONS = gql`${COLLECTIONS_STR}`;

  const { data, loading, error } = useQuery(COLLECTIONS, {
    fetchPolicy: "network-only",
  });

  console.log(`query: ${COLLECTIONS_STR}`);

  return { data, loading, error };
}

export default useCollectionsQuery;
