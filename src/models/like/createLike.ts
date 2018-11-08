import { Like } from "../../interfaces/models/like/like";
import { systemFields } from "../../utils/systemFIelds";

interface Input {
  id: string;
  collectionId: string;
  docId: string;
  docOwnerId?: string | null;
  ownerId: string;
}

export const createLike = (input: Input): Like => {
  return {
    ...systemFields(input.id),
    collectionId: input.collectionId,
    docId: input.docId,
    docOwnerId: input.docOwnerId,
    ownerId: input.ownerId
  };
};
