import { apiPost } from "./fetchHelper";

interface LoginRequest {
  name: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const login = async (
  req: LoginRequest
): Promise<LoginResponse | undefined> => {
  let resp = await apiPost(`/users/login`, req);
  return resp.json();
};

interface RegisterRequest {
  name: string;
  display_name: string;
  password: string;
  avatar_hash: string;
  group?: string;
}

export const register = async (
  req: RegisterRequest
): Promise<LoginResponse> => {
  return apiPost("/users", req).then((resp) => {
    if (resp.status === 409) {
      throw { reason: "Conflict" };
    }
    return resp.json();
  });
};
