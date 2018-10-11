import { firestore } from "firebase-admin";

export const toNode = (
  snapshot: firestore.DocumentSnapshot | firestore.DocumentSnapshot
): any | null => {
  if (!snapshot.exists) {
    return null;
  }

  return snapshot.exists
    ? (snapshot.data() as any)
    : { ...snapshot.data(), id: snapshot.id };
};
