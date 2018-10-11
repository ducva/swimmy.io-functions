import { Document } from "./document";
import { Node } from "./node";

export interface Image extends Node, Document {
  bucketName: string;
  filePath: string;
  imageURL: string;
}
