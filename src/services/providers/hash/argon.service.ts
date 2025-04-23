import * as argon from 'argon2';

export const hashDataArgon = async (dataToHash: string): Promise<string> => {
  return await argon.hash(dataToHash);
};

export const compareHashedDataArgon = async (
  dataToCompare: string,
  hashedData: string,
): Promise<boolean> => {
  return await argon.verify(hashedData, dataToCompare);
};
