import crypto       from 'crypto';
import * as jose    from 'jose';

const hasArrayData = (data: any[]): boolean => {
  return Array.isArray(data) && data.length > 0;
}


const hashPassword = (password: string): string => {
  const hash = crypto.createHash('sha256');

  hash.update(password);

  return hash.digest('hex');
}


const decodeJwtToken = async (token: string): Promise<jose.JWTPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    return payload;

  } catch (error: any) {
    console.log('Error decoding JWT Token in /services/functions.ts/decodeJwtToken(): ', error);
    return null;
  }
}


const isNumber = (value: any): boolean => {
  return !isNaN(Number(value));
}


const hasFieldWithValue = <T extends object, K extends keyof T>(obj: T, key: K, value?: T[K]): boolean => {
  if (!(key in obj)) return false;
  return true;
};


const isStringValidEmail = (email: string): boolean => {

  const regex = /^[^\d][\w'!#$%&*+/=?^_`{|}~.-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  // Check if it matches and doesn't contain any unusual/invalid apostrophes.
  if (!regex.test(email)) return false;

  // Reject if email contains strange Unicode apostrophes.
  const invalidApostrophes = /[‘’‚‛`´]/;

  if (invalidApostrophes.test(email)) return false;

  return true;
}


export {
  hasArrayData,
  hashPassword,
  decodeJwtToken,
  isNumber,
  hasFieldWithValue,
  isStringValidEmail
}