import { compareSync, hashSync } from 'bcrypt';

export const isPasswordValid = (reqPassword: string, password: string) => {
  return compareSync(reqPassword, password);
};

export const hashPassword = (password: string) => {
  return hashSync(password, 8);
};
