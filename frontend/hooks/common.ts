import * as jwt from "jsonwebtoken";

export interface Session {
  // The user identifier
  sub: string;
  // THe user display name
  display: string;
  // A list of permissions
  permissions: string[];
}

export const decode = (token: string): Session | undefined => {
  return (jwt.decode(token, { json: true }) as Session | null) ?? undefined;
};
