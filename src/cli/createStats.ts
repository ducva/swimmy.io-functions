import { credential, firestore, initializeApp } from "firebase-admin";
import serviceAccount from "../../service-account.json";
import { POSTS, STATS } from "../constants/collection";
import { Post } from "../interfaces/models/post/post";
import { createStat } from "../models/stats/createStat";
import { collection } from "../utils/collection";
import { createArrayInArray } from "../utils/createArrayInArray";
import { createId } from "../utils/createId";
import { document } from "../utils/document";

const main = async () => {
  initializeApp({ credential: credential.cert(serviceAccount) });

  firestore().settings({ timestampsInSnapshots: true });

  const posts = await collection(POSTS).get();

  const stats: {
    id: string;
    postCount: number;
    time: number;
    timestamp: firestore.Timestamp;
    createdAt: firestore.Timestamp;
    updatedAt: firestore.Timestamp;
  }[] = [];

  for (const postSnapshot of posts.docs) {
    const post = postSnapshot.data() as Post;
    const createdAt = post.createdAt.toDate();
    const date = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    );
    const time = date.getTime();
    const line = stats.find(line => line.time === time);
    if (line) {
      line.postCount = line.postCount + 1;
    } else {
      const newStat = createStat({
        statId: createId(),
        timestamp: post.createdAt
      });
      stats.push(newStat);
    }
  }

  for (const statsArray of createArrayInArray(stats)) {
    const batch = firestore().batch();
    for (const stat of statsArray) {
      batch.set(document(STATS, stat.id), stat);
    }
    await batch.commit();
  }

  console.log("length", posts.docs.length);
};

main().catch(err => {
  console.error(err);
});
