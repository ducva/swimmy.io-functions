import { firestore } from "firebase-admin";
import { region } from "firebase-functions";
import { LIKES } from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { Like } from "../interfaces/models/like/like";
import { Post } from "../interfaces/models/post/post";
import { document } from "../utils/document";

const path = `${LIKES}/{likeId}`;

const handler = async (snapshot: firestore.DocumentSnapshot) => {
  const like = snapshot.data() as Like;

  await firestore().runTransaction(async t => {
    const docRef = document(like.collectionId, like.docId);

    const docSnapshot = await t.get(docRef);

    if (!docSnapshot.exists) return;

    const doc = docSnapshot.data() as Post;

    t.update(docRef, { likeCount: doc.likeCount + 1 });
  });
};

export = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onCreate(handler);
