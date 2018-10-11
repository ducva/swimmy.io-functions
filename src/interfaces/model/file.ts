import { Document } from "./document";
import { Node } from "./node";

export interface File extends Node, Document {
  bucketName: string;
  contentType: string;
  filePath: string;
  size: number;
}
