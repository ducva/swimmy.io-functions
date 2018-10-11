import { firestore } from "firebase-admin";
import { toNode } from "./toNode";

export const toNodes = (snapshot: firestore.QuerySnapshot): any =>
  snapshot.docs.map(toNode);
