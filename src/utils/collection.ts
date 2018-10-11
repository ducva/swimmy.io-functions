import { firestore } from "firebase-admin";
import { createPath } from "./createPath";
import { isUndefined } from "./isUndefined";
import { log } from "./logger";

export const collection = (...paths: string[]): firestore.Query => {
  if (paths.length % 2 === 0) {
    throw new Error("paths.length === 0");
  }

  for (const path of paths) {
    if (isUndefined(path)) {
      log(__filename, "paths", paths);
      throw new Error("wrong path");
    }
  }

  return firestore().collection(createPath(paths));
};
