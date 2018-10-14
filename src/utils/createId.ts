import { app, firestore } from "firebase-admin";

export const createId = (app?: app.App): string => {
  if (app) {
    return app
      .firestore()
      .collection("sample")
      .doc().id;
  } else {
    return firestore()
      .collection("sample")
      .doc().id;
  }
};
