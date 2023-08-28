import { apiGet, apiPost } from "./fetchHelper";

export interface Challenge {
  id: number;
  hidden: boolean;
  name: string;
  description: string;
  reward: number;
  required_amount: number;
  tags: string[];
  created_at: string;
}

export const getChallenge = (challengeId: number): Promise<Challenge> => {
  return apiGet(`/challenges/${challengeId}`).then((resp) => resp.json());
};

export const listChallenges = (): Promise<Challenge[]> => {
  return apiGet("/challenges").then((resp) => resp.json());
};

export const listPersonalChallenges = (): Promise<Challenge[]> => {
  return apiGet("/challenges/personal").then((resp) => resp.json());
};

export const addChallengeProgress = (challengeId: number): Promise<void> => {
  return apiPost(`/challenges/${challengeId}`, {}).then(() => {});
};
