import { addSeconds } from 'date-fns';

export function newKeyExpiryDate(): Date {
  return addSeconds(new Date(), parseInt(process.env.ONE_TIME_KEY_EXPIRES_IN))
}
