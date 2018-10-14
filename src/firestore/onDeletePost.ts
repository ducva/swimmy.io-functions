import { firestore } from "firebase-admin";
import { EventContext, region } from "firebase-functions";
import {
  FILES,
  POSTS,
  POSTS_AS_IMAGE,
  POSTS_AS_THREAD, USERS
} from "../constants/collection";
import { isPostAsImage } from "../helpers/isPostAsImage";
import { isPostAsThread } from "../helpers/isPostAsThread";
import { Post } from "../interfaces/models/post/post";
import { document } from "../utils/document";
import { toNode } from "../utils/toNode";

const path = `${POSTS}/{postId}`;

const handler = async (snapshot: firestore.DocumentSnapshot, context: EventContext): Promise<void> => {
  const post: Post = toNode(snapshot);

  const { postId } = context.params;

  for (let fileId of post.fileIds) {
    await document(FILES, fileId).delete();
  }

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
        replyPostCount: repliedPost.replyPostCount - 1
      });
    });
  }

  if (!post.replyPostId) {
    if (post.ownerId) {
      document(USERS, post.ownerId, POSTS, postId).delete();
    }

    if (isPostAsThread(post)) {
      await document(POSTS_AS_THREAD, postId).delete();
    }

    if (isPostAsImage(post)) {
      await document(POSTS_AS_IMAGE, postId).delete();
    }
  }
};

export = region("asia-northeast1")
  .firestore.document(path)
  .onDelete(handler);
