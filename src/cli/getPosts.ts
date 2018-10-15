import { credential, firestore, initializeApp } from "firebase-admin";
import { POSTS } from "../constants/collection";
import { collection } from "../utils/collection";
import { getConfig } from "../utils/getConfig";

const main = async () => {
  const config = getConfig("umfzwkzvrtpe");

  initializeApp({ credential: credential.cert(config.firebase) });

  firestore().settings({ timestampsInSnapshots: true });

  const posts = await collection(POSTS).get();

  console.log("length", posts.docs.length);
};

main().catch(err => {
  console.error(err);
});
