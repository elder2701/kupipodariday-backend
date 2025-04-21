import * as bcrypt from 'bcryptjs';

export const hashValue = (value: string) => bcrypt.hash(value, 10);

export const verifyHash = (value: string, hash: string) => {
  return bcrypt.compare(value, hash);
};
