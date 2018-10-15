import { https, region } from "firebase-functions";
import { IMAGES, POSTS, POSTS_AS_ANONYM } from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { CreatePostData } from "../interfaces/https/createPostData";
import { Image } from "../interfaces/models/image/image";
import { createPost } from "../models/post/createPost";
import { createPostAsAnonym } from "../models/post/createPostAsAnonym";
import { createId } from "../utils/createId";
import { document } from "../utils/document";
import { getUser } from "../utils/getUser";

const handler = async (
  data: CreatePostData,
  context: https.CallableContext
) => {
  const startTime = Date.now();

  const owner = getUser(context);

  const postId = createId();

  const photoURLs: string[] = [];

  for (const fileId of data.fileIds) {
    const imageSnapshot = await document(IMAGES, fileId).get();

    if (!imageSnapshot.exists) {
      throw new https.HttpsError("cancelled", "image not found");
    }

    const image = imageSnapshot.data() as Image;

    photoURLs.push(image.imageURL);
  }

  const post = await createPost({
    postId,
    text: data.text,
    replyPostId: data.replyPostId,
    fileIds: data.fileIds,
    photoURLs,
    owner,
    ownerId: owner ? owner.uid : null
  });

  await document(POSTS, postId).set(post);

  const postAsAnonymous = createPostAsAnonym(post);

  if (post.replyPostId) {
    await document(POSTS_AS_ANONYM, post.replyPostId, POSTS, postId).set(
      postAsAnonymous
    );
  }

  if (!post.replyPostId) {
    await document(POSTS_AS_ANONYM, postId).set(postAsAnonymous);
  }

  const time = Date.now() - startTime;

  return { time, data: { post } };
};

export = region(ASIA_NORTHEAST1).https.onCall(handler);