import { config } from 'dotenv';
config();

const saltRounds = Number.parseInt(process.env['HASH_DIFFICULTY']) || 15;

export const BcryptHelper = {
  saltRounds,
};
