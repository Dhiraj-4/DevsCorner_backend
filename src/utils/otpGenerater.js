import crypto from 'crypto'; 

export const generateSecureOTP = () => {
  const digits = '0123456789';
  return Array.from(crypto.randomFillSync(new Uint8Array(6)))
    .map(x => digits[x % 10])
    .join('');
};