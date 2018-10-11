import fetch from "node-fetch";
import { getConfig } from "../utils/getConfig";

export const createImageURL = async (filePath: string) => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string);

  const config = getConfig();

  const res = await fetch(config.app.images, {
    method: "POST",
    body: JSON.stringify({
      bucketName: `${projectId}.appspot.com`,
      filePath: filePath
    }),
    headers: { "Content-Type": "application/json" }
  });

  const { data } = await res.json();

  if (!data) {
    return null;
  }

  return data;
};
