import { cookies } from "next/headers";
import { Session, decode } from "./common";


const getUserServer = () => {
  const cookie = cookies().get("access_token");
  if (cookie === undefined) {
    return undefined;
  }
  return decode(cookie.value);
};

export const getAuthToken = (): string | undefined => {
  return cookies().get("access_token")?.value;
};

export default function getUser(): Session | undefined {
  return getUserServer();
}
