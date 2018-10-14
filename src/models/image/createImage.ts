import { Image } from "../../interfaces/models/image/image";
import { systemFields } from "../../utils/systemFIelds";

interface Input {
  id: string;
  imageURL: string;
  bucketName: string;
  filePath: string;
}

export const createImage = (input: Input): Image => {
  return {
    ...systemFields(input.id),
    imageURL: input.imageURL,
    bucketName: input.bucketName,
    filePath: input.filePath
  };
};
