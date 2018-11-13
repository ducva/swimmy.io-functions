import { config } from "firebase-functions";
import fetch from "node-fetch";

export const createImageURL = async (filePath: string) => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string);

  const appConfig = config().app;

  if (!appConfig || !appConfig.images) {
    return null;
  }

  const res = await fetch(appConfig.images, {
    method: "POST",
    body: JSON.stringify({
      bucketName: `${projectId}.appspot.com`,
      filePath
    }),
    headers: { "Content-Type": "application/json" }
  });

  const { data } = await res.json();

  if (!data) {
    return null;
  }

  return data;
};
