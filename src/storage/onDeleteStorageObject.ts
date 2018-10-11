import { region } from "firebase-functions";
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";
import { IMAGES } from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { document } from "../utils/document";
import { toFileName } from "../utils/toFileName";

const handler = async (object: ObjectMetadata) => {
  if (typeof object.name !== "string") {
    throw new Error("object.name not found");
  }

  const imageId = toFileName(object.name);

  await document(IMAGES, imageId).delete();
};

export = region(ASIA_NORTHEAST1)
  .storage.object()
  .onDelete(handler);
