import algoliasearch from "algoliasearch";
import { config } from "firebase-functions";

export const createIndex = (name: string): algoliasearch.Index | void => {
  const algoliaConfig = config().algolia;

  if (!algoliaConfig) {
    return;
  }

  if (!algoliaConfig.id || !algoliaConfig.adminKey) {
    return;
  }

  const client = algoliasearch(algoliaConfig.id, algoliaConfig.adminKey);

  return client.initIndex(name);
};
