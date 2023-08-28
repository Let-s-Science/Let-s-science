import { decode, Session } from "./common";

export const getAuthToken = (): string | undefined => {
  return document.cookie
    .split(", ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];
};

export const getUser = (): Session | undefined => {
  const token = getAuthToken();
  if (token === undefined) return undefined;
  return decode(token);
};
