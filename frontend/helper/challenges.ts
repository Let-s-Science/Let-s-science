import { Challenge } from "../client";

export interface ChallengeStats {
  challenge: Challenge;
  currProgress: number;
  doneTimes: number;
  lastProgress: Date | undefined;
}

export const parseChallenges = (challenges: Challenge[]): ChallengeStats[] => {
  const chMap: { [key: number]: ChallengeStats } = {};
  challenges.forEach((ch) => {
    if (ch.id in chMap) {
      const savedChallenge = chMap[ch.id];
      if (savedChallenge.currProgress + 1 === ch.required_amount) {
        savedChallenge.currProgress = 0;
        savedChallenge.doneTimes += 1;
        savedChallenge.lastProgress = undefined;
      } else {
        savedChallenge.currProgress += 1;
        savedChallenge.lastProgress = new Date(ch.created_at);
      }
    } else {
      chMap[ch.id] = {
        challenge: ch,
        currProgress: 1,
        doneTimes: 0,
        lastProgress: new Date(ch.created_at),
      };
    }
  });

  return Object.values(chMap);
};
