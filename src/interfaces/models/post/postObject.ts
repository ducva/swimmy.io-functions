import { Owner } from '../shared/owner'
import { AlgoliaObject } from '../system/algoliaObject'
import { Node } from '../system/node'

export interface PostObject extends Node, AlgoliaObject {
  text: string
  owner: Owner | null
  ownerId: string | null
  photoURLs: string[]
  replyPostId: string | null
  replyPostCount: number
  likeCount: number
}
