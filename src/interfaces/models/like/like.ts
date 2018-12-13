import { Document } from '../system/document'
import { Node } from '../system/node'

export interface Like extends Node, Document {
  collectionId: string
  docId: string
  docOwnerId?: string | null
  ownerId: string
}
