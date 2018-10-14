import { firestore } from "firebase-admin";

interface Root {
  id: string;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export const systemFieldsForAlgolia = (root: Root) => {
  return {
    objectID: root.id,
    createdAt: root.createdAt.seconds,
    updatedAt: root.updatedAt.seconds
  };
};
