import { firestore } from "firebase-admin";

import { LIKES, POSTS } from "../../constants/collection";
import { Like } from "../../interfaces/models/like/like";
import { Post } from "../../interfaces/models/post/post";
import { collection } from "../../utils/collection";
import { document } from "../../utils/document";

export const switchLike = async (newLike: Like) => {
  return firestore().runTransaction(async t => {
    const LikesRef = collection(LIKES)
      .where("collectionId", "==", newLike.collectionId)
      .where("docId", "==", newLike.docId)
      .where("ownerId", "==", newLike.ownerId)
      .limit(1);

    const likeQuerySnapshot = await t.get(LikesRef);
    const likeSnapshot = likeQuerySnapshot.empty
      ? null
      : likeQuerySnapshot.docs[0];

    const postRef = document(POSTS, newLike.docId);
    const postSnapshot = await t.get(postRef);

    if (!postSnapshot.exists) {
      throw new Error("postSnapshot.exists");
    }

    const post = postSnapshot.data() as Post;

    const updatedAt = firestore.Timestamp.now();

    if (likeSnapshot) {
      const likeRef = document(LIKES, likeSnapshot.id);
      t.delete(likeRef);
      t.update(postRef, { likeCount: post.likeCount - 1, updatedAt });
    } else {
      const likeRef = document(LIKES, newLike.id);
      t.set(likeRef, newLike);
      t.update(postRef, { likeCount: post.likeCount + 1, updatedAt });
    }
  });
};
