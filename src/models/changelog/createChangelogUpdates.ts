import { firestore } from 'firebase-admin';
import { ChangelogUpdates } from '../../interfaces/models/changelog/changelogUpdates';

interface Input {
  text: string,
  date: firestore.Timestamp,
  changelogType: string
}

export const createChangelogUpdates = (input: Input): ChangelogUpdates => {
  const now = firestore.Timestamp.now();

  return {
    text: input.text,
    date: input.date,
    updatedAt: now,
    changelogType: input.changelogType,
  };
};
