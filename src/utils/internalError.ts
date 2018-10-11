import { https } from "firebase-functions";

export const internalError = (e: any) => {
  if (e.errorInfo) {
    return new https.HttpsError(
      "internal",
      e.errorInfo.code,
      e.errorInfo.message
    );
  } else {
    return new https.HttpsError("internal", e.message);
  }
};
