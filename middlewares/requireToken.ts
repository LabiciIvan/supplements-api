import { Request, Response, NextFunction } from 'express';

/**
 * This middleware works as a token require.
 *
 * It checks if the request has a Bearer token attached to the requst object otherwise aborts any
 * further processing.
 *
 * <requireToken> -> isTokenValid
 */
const requireToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = (req as any).bearerToken;

  if (!token) {
    return res.status(401).json({ message: 'Missing Authorization header.' });
  }

  next();
}

export default requireToken;