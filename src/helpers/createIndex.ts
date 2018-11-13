import algoliasearch from "algoliasearch";
import { config } from "firebase-functions";

export const createIndex = (
  name: string,
  { id, key }: { id?: string; key?: string } = {}
): algoliasearch.Index | void => {
  if (id && key) {
    const client = algoliasearch(id, key);

    return client.initIndex(name);
  }

  const algoliaConfig = config().algolia;

  if (!algoliaConfig) {
    return;
  }

  if (!algoliaConfig.id || !algoliaConfig.key) {
    return;
  }

  const client = algoliasearch(algoliaConfig.id, algoliaConfig.key);

  return client.initIndex(name);
};
