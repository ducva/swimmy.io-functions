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
import { createIndex } from "../helpers/createIndex";
import { isNotPostAsAnonym } from "../helpers/isNotPostAsAnonym";
import { isNotPostAsThread } from "../helpers/isNotPostAsThread";
import { isPostAsImage } from "../helpers/isPostAsImage";
import { isPostAsThread } from "../helpers/isPostAsThread";
import { Post } from "../interfaces/models/post/post";
import { createPostAsAnonym } from "../models/post/createPostAsAnonym";
import { createPostObject } from "../models/post/createPostObject";
import { document } from "../utils/document";

const path = `${POSTS}/{postId}`;

const handler = async (
  change: Change<firestore.DocumentSnapshot>,
  context: EventContext
) => {
  const post = change.after.data() as Post;
  const { postId } = context.params;

  await document(POSTS_AS_ANONYM, postId).set(post);

  const postAsAnonymous = createPostAsAnonym(post);

  if (isNotPostAsAnonym(post)) {
    if (post.ownerId) {
      document(USERS, post.ownerId, POSTS, postId).set(postAsAnonymous);
    }
  }

  if (isPostAsThread(post)) {
    await document(POSTS_AS_THREAD, postId).set(postAsAnonymous);
    const index = createIndex(POSTS_AS_THREAD);
    if (index) {
      const postObject = createPostObject(post);
      await index.saveObject(postObject);
    }
  }

  if (isNotPostAsThread(post)) {
    await document(POSTS_AS_THREAD, postId).delete();
    const index = createIndex(POSTS_AS_THREAD);
    if (index) {
      await index.deleteObject(postId);
    }
  }

  if (isPostAsImage(post)) {
    await document(POSTS_AS_IMAGE, postId).set(postAsAnonymous);
    const index = createIndex(POSTS_AS_IMAGE);
    if (index) {
      const postObject = createPostObject(post);
      await index.saveObject(postObject);
    }
  }
};

export = region(ASIA_NORTHEAST1)
  .firestore.document(path)
  .onUpdate(handler);
