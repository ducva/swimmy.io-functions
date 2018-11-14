import { firestore } from "firebase-admin";
import { Document } from "../system/document";
import { Node } from "../system/node";

export interface Stat extends Node, Document {
  postCount: number;
  time: number;
  timestamp: firestore.Timestamp;
}
