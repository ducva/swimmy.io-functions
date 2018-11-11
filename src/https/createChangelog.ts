import { firestore } from "firebase-admin";
import { https, region } from "firebase-functions";
import { CHANGELOGS } from "../constants/collection";
import { ASIA_NORTHEAST1 } from "../constants/region";
import { CreateChangelog } from "../interfaces/https/createChangelog";
import { Changelog } from "../interfaces/models/changelog/changelog";
import { createChangelog } from "../models/changelog/createChangelog";
import { createId } from "../utils/createId";
import { document } from "../utils/document";
import { getUserId } from "../utils/getUserId";
import { internalError } from "../utils/internalError";
import { isUndefined } from "../utils/isUndefined";

const handler = async (
  data: CreateChangelog,
  context: https.CallableContext
) => {
  if (isUndefined(data.contents)) {
    throw new https.HttpsError("invalid-argument", "contents not found");
  }

  if (isUndefined(data.date)) {
    throw new https.HttpsError("invalid-argument", "date not found");
  }

  if (isUndefined(data.version)) {
    throw new https.HttpsError("invalid-argument", "version not found");
  }

  const uid = getUserId(context);

  if (!uid) {
    throw new https.HttpsError("unauthenticated");
  }

  if (uid !== "nM3s6pYpDa6qykNzK") {
    throw new https.HttpsError("permission-denied");
  }

  const newChangelogId = createId();

  const newChangelog: Changelog = createChangelog({
    changelogId: newChangelogId,
    contents: data.contents,
    date: firestore.Timestamp.fromDate(new Date(data.date)),
    version: data.version
  });

  try {
    await document(CHANGELOGS, newChangelogId).set(newChangelog);
  } catch (e) {
    throw internalError(e);
  }

  return { data: { changelog: newChangelog } };
};

export = region(ASIA_NORTHEAST1).https.onCall(handler);
