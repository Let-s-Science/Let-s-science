"use server";

import { cookies } from "next/headers";

export const setUserCookie = (access_token: string) => {
  cookies().set("access_token", access_token, {
    secure: process.env.NODE_ENV === "production" ? true : undefined,
  });
};
