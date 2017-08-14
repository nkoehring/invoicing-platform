
// imports
import uuid from 'uuid';
import bs58 from 'bs58';

// local imports
import { uuidToBase58 } from './item-util';

export function createId() {
  // random uuid
  const id = uuid.v4();
  return toBase58(id);
}

export function createOrderedId() {
  // time ordered uuid
  const orderedId = uuid.v1();
  return toBase58(orderedId);
}
