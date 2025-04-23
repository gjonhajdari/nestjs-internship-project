import * as bcrypt from 'bcrypt';

export const hashDataBrypt = async (dataToHash: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(dataToHash, salt);
};

export const compareHashedDataBcrypt = async (
  dataToCompare: string,
  hashedData: string,
): Promise<boolean> => {
  return await bcrypt.compare(dataToCompare, hashedData);
};
