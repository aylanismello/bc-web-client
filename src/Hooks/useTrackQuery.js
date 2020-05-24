import { useApolloClient, gql, useQuery } from "@apollo/client";

const SEARCH_TRACK = gql`
  query GetTrack($id: Int) {
    getTrack(id: $id) {
      name
      curators {
        name
        soundcloud_id
        permalink_url
        avatar_url
      }
    }
  }
`;

function useTrackQuery(id) {
  if(!id) {
    return { loading: true, data: null };
  }

  const { error, data, loading } = useQuery(SEARCH_TRACK, {
    variables: { id },
  } );

  return { data, error, loading };
}

export default useTrackQuery;
