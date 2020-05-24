import React from "react";
import App from "../App";
import useCollectionsQuery from "../../Hooks/useCollectionsQuery";

const liveDataVsCached = (liveData, cached) => {
  console.log("OUR DATA IS OUT OF SYNC - here is our data");
  console.log(liveData);
  console.log("THIS IS OUR CACHED RESULTS");
  console.log(cached);
};

function AppHooks() {
  const { data, loading, error } = useCollectionsQuery({
    fetchPolicy: "network-only",
  });

  const graphqlCollections = loading || error ? [] : data.collections;

  return <App />;
}

export default AppHooks;
