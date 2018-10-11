import * as config from "../../config.json";

export const getConfig = (): any => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string);

  return (config as any)[projectId];
};
