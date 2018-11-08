import { firestore } from "firebase-admin";
import { Changelog } from "../../interfaces/models/changelog/changelog";
import { systemFields } from "../../utils/systemFIelds";

interface Input {
  changelogType: string;
  changelogId: string;
  date: firestore.Timestamp;
  text: string;
  version: number;
}

export const createChangelog = (input: Input): Changelog => {
  return {
    ...systemFields(input.changelogId),
    text: input.text,
    date: input.date,
    changelogType: input.changelogType,
    version: input.version
  };
};
