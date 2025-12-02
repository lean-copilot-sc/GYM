import { connectDB } from './db.js';
import { verifyToken } from './jwt.js';
import { unauthorized, forbidden, serverError } from './response.js';
import '../models/User.js'; // ensure User schema is registered for populate refs

export function withDatabase(fn) {
  return async (event) => {
    try {
      await connectDB(process.env.MONGO_URI);
      return await fn(event);
    } catch (error) {
      console.error('Handler error', error);
      return serverError(error);
    }
  };
}

export function withAuth(fn, options = {}) {
  const { roles } = options;

  return withDatabase(async (event) => {
    const token = getTokenFromEvent(event);
    const decoded = verifyToken(token);

    if (!decoded) {
      return unauthorized();
    }

    if (roles?.length && !roles.includes(decoded.role)) {
      return forbidden('Insufficient permissions');
    }

    event.user = decoded;
    return fn(event);
  });
}

function getTokenFromEvent(event) {
  const header = event.headers?.Authorization || event.headers?.authorization;
  if (!header) return null;
  if (header.startsWith('Bearer ')) {
    return header.substring(7);
  }
  return header;
}
