import { mockEntries } from './mockEntries';

// Sort entries by vote count descending and take top 10
export const mockLeaderboard = [...mockEntries]
  .sort((a, b) => b.voteCount - a.voteCount)
  .slice(0, 10)
  .map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
