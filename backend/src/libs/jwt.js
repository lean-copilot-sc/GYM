import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signToken(payload, options = {}) {
  if (!SECRET) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign(payload, SECRET, { expiresIn: '7d', ...options });
}

export function verifyToken(token) {
  if (!token || !SECRET) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
