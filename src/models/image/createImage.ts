import { Image } from "../../interfaces/model/image";
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
