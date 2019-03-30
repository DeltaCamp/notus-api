import { addHours } from 'date-fns';

export function newKeyExpiryDate(): Date {
  return addHours(new Date(), 24)
}
