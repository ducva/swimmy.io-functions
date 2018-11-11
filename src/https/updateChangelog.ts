import { firestore } from "firebase-admin";
import { https, region } from "firebase-functions";
import { CHANGELOGS } from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { UpdateChangelog } from "../interfaces/https/updateChangelog";
import { createChangelogUpdates } from "../models/changelog/createChangelogUpdates";
import { document } from "../utils/document";
import { getUserId } from "../utils/getUserId";
import { internalError } from "../utils/internalError";
import { isUndefined } from "../utils/isUndefined";

const handler = async (
  data: UpdateChangelog,
  context: https.CallableContext
) => {
  if (isUndefined(data.changelogId)) {
    throw new https.HttpsError("invalid-argument", "changelogId not found");
  }

  if (isUndefined(data.contents)) {
    throw new https.HttpsError("invalid-argument", "contents not found");
  }

  if (isUndefined(data.date)) {
    throw new https.HttpsError("invalid-argument", "date not found");
  }

  const uid = getUserId(context);

  if (!uid) {
    throw new https.HttpsError("unauthenticated");
  }

  if (uid !== "nM3s6pYpDa6qykNzK") {
    throw new https.HttpsError("permission-denied");
  }

  const changelogUpdates = createChangelogUpdates({
    contents: data.contents,
    date: firestore.Timestamp.fromDate(new Date(data.date))
  });

  try {
    await document(CHANGELOGS, data.changelogId).update(changelogUpdates);
  } catch (e) {
    throw internalError(e);
  }

  return { data: { changelogUpdates } };
};

export = region(ASIA_NORTHEAST1).https.onCall(handler);
