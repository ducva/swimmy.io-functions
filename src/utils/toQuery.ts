import { firestore } from 'firebase-admin'

export interface Args {
  first?: number
  after?: string | null
  orderBy?: {
    field: string
    direction: any
  }
}

export const toQuery = (args: Args, collectionRef: firestore.Query) => async (
  ref: firestore.Query
) => {
  let query: firestore.Query = ref

  if (args.first) {
    query = query.limit(args.first)
  }

  if (args.after) {
    const snapshot = await collectionRef.firestore.doc(args.after).get()

    if (snapshot.exists) {
      query = query.startAfter(snapshot)
    }
  }

  if (args.orderBy) {
    query = query.orderBy(args.orderBy.field, args.orderBy.direction)
  }

  return query
}
