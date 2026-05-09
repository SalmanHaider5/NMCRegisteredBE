export type VerifyUserParams = {
  userId: string;
  token: string;
};

export type UpdatePasswordPayload = {
  userId: number;
  password: string;
};

export type UserResponse = {
  message: string;
  data: unknown;
};
