import { Comment } from '../../types/models';
import { mockUsers } from './mockUsers';
import { mockEntries } from './mockEntries';

export const generateMockComments = (entryId: string): Comment[] => {
  return Array.from({ length: 15 }).map((_, index) => {
    const user = mockUsers[(index + 3) % mockUsers.length];
    return {
      id: `c-${entryId}-${index}`,
      entryId,
      userId: user.id,
      text: [
        'This is absolutely amazing! 🔥',
        'How long did it take you to learn this?',
        'Such a beautiful cover, keep it up!',
        "I've been listening to this on repeat.",
        'Your voice is incredible! 👏',
        'This fits the challenge theme perfectly.',
        'So talented! ✨',
        'Wow, just wow.',
        "Can't wait to see what you do next week.",
        'This deserves to win! 😍',
        'Incredible performance.',
        'The guitar arrangement is beautiful.',
        'You always bring such good vibes.',
        "Honestly the best one I've seen today.",
        'Love this so much ❤️',
      ][index % 15],
      positivityScore: 0.95,
      isPinned: index === 0,
      parentId: index > 10 ? `c-${entryId}-${index - 5}` : null,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 86400000),
      ).toISOString(),
      likeCount: Math.floor(Math.random() * 100),
      user,
    };
  });
};

// Store comments per entry to keep it somewhat stable during runtime mock
export const mockCommentsRecord: Record<string, Comment[]> = {};
mockEntries.forEach(entry => {
  mockCommentsRecord[entry.id] = generateMockComments(entry.id);
});
