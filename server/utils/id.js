import { v7 as uuidv7 } from "uuid";

/**
 * Generate UUIDv7 for public_id
 */
export const generatePublicId = () => {
  return uuidv7();
};
