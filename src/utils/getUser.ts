import { CallableContext } from "firebase-functions/lib/providers/https";
import { Owner } from "../interfaces/models/shared/owner";

export const getUser = (context: CallableContext): Owner | null => {
  if (typeof context.auth === "undefined") {
    return null;
  }

  return {
    uid: context.auth.uid,
    displayName: context.auth.token.name,
    photoURL: context.auth.token.picture
  };
};
