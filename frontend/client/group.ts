import { apiGet, apiPost } from "./fetchHelper";

export interface Group {
  id: number;
  name: string;
  avatar_hash: string;
  join_phrase: string;
}

interface JoinGroupRequest {
  join_phrase: string;
}

export const joinGroup = (req: JoinGroupRequest) => {
  return apiPost("/groups/join", req);
};

interface CreateGroupRequest {
  name: string;
  avatar_hash: string;
}

interface CreateGroupResponse {
  join_phrase: string;
}

export const createGroup = (
  req: CreateGroupRequest
): Promise<CreateGroupResponse> => {
  return apiPost("/groups", req).then((resp) => resp.json());
};

export const listGroups = (): Promise<Group[]> => {
  return apiGet("/groups").then((resp) => resp.json());
};
