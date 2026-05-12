import { Entry } from '../../types/models';
import { mockUsers } from './mockUsers';
import { activeChallenge } from './mockChallenge';

// Helper to get a random user
const getRandomUser = (index: number) => mockUsers[index % mockUsers.length];

// Helper to generate varied vote counts
const generateVoteCount = (index: number) => {
  const base = [
    2847, 1500, 1230, 950, 800, 650, 500, 420, 310, 200, 150, 80, 45, 12, 5,
  ];
  return base[index % base.length] + Math.floor(Math.random() * 50);
};

export const mockEntries: Entry[] = Array.from({ length: 20 }).map(
  (_, index) => {
    const user = getRandomUser(index);
    return {
      id: `e-${index + 1}`,
      challengeId: activeChallenge.id,
      userId: user.id,
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Safe sample video
      thumbnailUrl: `https://picsum.photos/seed/${index + 1}/400/600`, // Random placeholder
      caption:
        "My submission for this week's challenge! Hope you enjoy this acoustic vibe ✨ #AcousticCovers",
      duration: 45 + Math.floor(Math.random() * 15),
      voteCount: generateVoteCount(index),
      reactionCounts: {
        fire: Math.floor(Math.random() * 100),
        heart: Math.floor(Math.random() * 50),
        party: Math.floor(Math.random() * 30),
        clap: Math.floor(Math.random() * 80),
        sparkle: Math.floor(Math.random() * 40),
        love: Math.floor(Math.random() * 60),
      },
      status: 'live',
      moderationScore: 0.1,
      rejectionReason: null,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 100000000),
      ).toISOString(),
      rank: null,
      user: user,
      challenge: activeChallenge,
    };
  },
);
