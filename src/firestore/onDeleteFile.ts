import { firestore, storage } from "firebase-admin";
import { region } from "firebase-functions";
import { FILES } from "../constants/collection";
import { File } from "../interfaces/model/file";
import { toNode } from "../utils/toNode";

const path = `${FILES}/{fileId}`;

const handler = async (snapshot: firestore.DocumentSnapshot): Promise<void> => {
  const file: File = toNode(snapshot);

  await storage()
    .bucket(file.bucketName)
    .file(file.filePath)
    .delete();
};

export = region("asia-northeast1")
  .firestore.document(path)
  .onDelete(handler);
