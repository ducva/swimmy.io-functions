import { config } from "firebase-functions";
import fetch from "node-fetch";

export const deleteImageURL = async (bucketName: string, filePath: string) => {
  const appConfig = config().app;

  if (!appConfig || !appConfig.images) {
    return null;
  }

  await fetch(appConfig.images, {
    method: "DELETE",
    body: JSON.stringify({ bucketName, filePath }),
    headers: { "Content-Type": "application/json" }
  });

  return null;
};
