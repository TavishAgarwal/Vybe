import { Challenge } from '../../types/models';
import {
  addDays,
  nextSunday,
  previousMonday,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';

const today = new Date();
const start = setSeconds(setMinutes(setHours(previousMonday(today), 0), 0), 0);
const end = setSeconds(setMinutes(setHours(addDays(start, 5), 23), 59), 59); // Saturday 23:59
const reveal = setSeconds(setMinutes(setHours(nextSunday(today), 23), 59), 59); // Sunday 23:59

export const activeChallenge: Challenge = {
  id: 'c-1',
  title: 'Acoustic Covers',
  description: 'Show us your best acoustic cover of any popular song.',
  category: 'singing',
  weekNumber: 42,
  year: today.getFullYear(),
  startDate: start.toISOString(),
  endDate: end.toISOString(),
  revealDate: reveal.toISOString(),
  coverImageUrl:
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1000&auto=format&fit=crop',
  promptText: 'Cover any acoustic song, original or classic',
  status: 'voting',
  winnerId: null,
  runnerUp1Id: null,
  runnerUp2Id: null,
};
