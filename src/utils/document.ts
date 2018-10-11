import { firestore } from "firebase-admin";
import { createPath } from "./createPath";
import { isUndefined } from "./isUndefined";

export const document = (...paths: string[]): firestore.DocumentReference => {
  if (paths.length % 2 !== 0) {
    throw new Error("paths.length !== 0");
  }

  for (const path of paths) {
    if (isUndefined(path)) {
      throw new Error("wrong path");
    }
  }

  return firestore().doc(createPath(paths));
};
