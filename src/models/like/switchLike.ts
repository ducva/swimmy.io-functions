import { firestore } from "firebase-admin";

import { LIKES } from "../../constants/collection";
import { Like } from "../../interfaces/models/like/like";
import { collection } from "../../utils/collection";
import { document } from "../../utils/document";

export const switchLike = async (newLike: Like): Promise<Like> => {
  return firestore().runTransaction(async t => {
    const LikeRef = collection(LIKES)
      .where("collectionId", "==", newLike.collectionId)
      .where("docId", "==", newLike.docId)
      .where("ownerId", "==", newLike.ownerId)
      .limit(1);

    const likeQuerySnapshot = await t.get(LikeRef);
    const likeSnapshot = likeQuerySnapshot.empty
      ? null
      : likeQuerySnapshot.docs[0];

    if (likeSnapshot) {
      const likeRef = document(LIKES, likeSnapshot.id);
      t.delete(likeRef);
      return likeSnapshot.data() as Like;
    } else {
      const likeRef = document(LIKES, newLike.id);
      t.set(likeRef, newLike);
      return newLike;
    }
  });
};
