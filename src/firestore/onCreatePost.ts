import { firestore } from "firebase-admin";
import { EventContext, region } from "firebase-functions";
import { POSTS, POSTS_AS_IMAGE, USERS } from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { isPostAsImage } from "../helpers/isPostAsImage";
import { Post } from "../interfaces/models/post/post";
import { document } from "../utils/document";

const path = `${POSTS}/{postId}`;

const handler = async (
  snapshot: firestore.DocumentSnapshot,
  context: EventContext
) => {
  const post = snapshot.data() as Post;

  const { postId } = context.params;

  if (post.replyPostId) {
    await firestore().runTransaction(async t => {
      if (post.replyPostId === null) {
        return;
      }

      const repliedPostRef = document(POSTS, post.replyPostId);

      const repliedPostSnapshot = await t.get(repliedPostRef);

      if (!repliedPostSnapshot.exists) return;

      const repliedPost = repliedPostSnapshot.data() as Post;

      t.update(repliedPostRef, {
        replyPostCount: repliedPost.replyPostCount + 1
      });
    });
  }

  if (!post.replyPostId) {
    if (post.ownerId) {
      document(USERS, post.ownerId, POSTS, postId).set(post);
    }

    if (isPostAsImage(post)) {
      await document(POSTS_AS_IMAGE, postId).set(post);
    }
  }
};

export = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onCreate(handler);
