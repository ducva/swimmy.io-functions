import { firestore } from "firebase-admin";

export const createId = (): string => {
  return firestore()
    .collection("sample")
    .doc().id;
};
