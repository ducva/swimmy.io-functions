import { firestore } from "firebase-admin";
import { Change, EventContext, region } from "firebase-functions";
import {
  POSTS,
  POSTS_AS_ANONYM,
  POSTS_AS_IMAGE,
  POSTS_AS_THREAD,
  USERS
} from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { isPostAsImage } from "../helpers/isPostAsImage";
import { isPostAsThread } from "../helpers/isPostAsThread";
import { Post } from "../interfaces/models/post/post";
import { document } from "../utils/document";

const path = `${POSTS}/{postId}`;

const handler = async (
  change: Change<firestore.DocumentSnapshot>,
  context: EventContext
) => {
  const post = change.after.data() as Post;
  const { postId } = context.params;

  await document(POSTS_AS_ANONYM, postId).set(post);

  if (!post.replyPostId) {
    if (post.ownerId) {
      document(USERS, post.ownerId, POSTS).set(post);
    }

    if (isPostAsThread(post)) {
      await document(POSTS_AS_THREAD, postId).set(post);
    }

    if (!isPostAsThread(post)) {
      await document(POSTS_AS_THREAD, postId).delete();
    }

    if (isPostAsImage(post)) {
      await document(POSTS_AS_IMAGE, postId).set(post);
    }
  }
};

export = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onUpdate(handler);
