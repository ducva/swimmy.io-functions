import { firestore } from "firebase-admin";
import { Update } from "../system/update";

export interface ChangelogUpdates extends Update {
  contents: string[];
  date: firestore.Timestamp;
}
