import { Document } from "../system/document";
import { Node } from "../system/node";

export interface Image extends Node, Document {
  bucketName: string;
  filePath: string;
  imageURL: string;
}
