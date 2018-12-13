import { Document } from '../system/document'
import { Node } from '../system/node'

export interface File extends Node, Document {
  bucketName: string
  contentType: string
  filePath: string
  size: number
}
