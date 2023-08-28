import { getAuthToken } from "../hooks/userClient";

export const apiPost = (
  path: string,
  body: any,
  opts?: RequestInit
): Promise<Response> => {
  const token = getAuthToken();
  const headers = token === undefined ? undefined : { AUTH_TOKEN: token };
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...opts?.headers,
    },
    credentials: "include",
    ...opts,
  });
};

export const apiGet = (path: string, opts?: RequestInit): Promise<Response> => {
  const token = getAuthToken();
  const headers = token === undefined ? undefined : { AUTH_TOKEN: token };
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "GET",
    headers: {
      ...headers,
      ...opts?.headers,
    },
    credentials: "include",
    ...opts,
  });
};
