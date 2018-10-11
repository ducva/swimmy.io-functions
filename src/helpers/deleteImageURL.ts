import fetch from "node-fetch";
import { getConfig } from "../utils/getConfig";

export const deleteImageURL = async (bucketName: string, filePath: string) => {
  const config = getConfig();

  await fetch(config.app.images, {
    method: "DELETE",
    body: JSON.stringify({ bucketName, filePath }),
    headers: { "Content-Type": "application/json" }
  });

  return null;
};
