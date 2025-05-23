import { Request, Response, NextFunction } from 'express';

/**
 * This middleware works as a token attach.
 *
 * If exists Bearer token in the Authorization header it attaches it to the request object.
 */
const attachToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const hasBearerToken = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;

  if (hasBearerToken) {
    (req as any).bearerToken = hasBearerToken;
  }

  next();
}

export default attachToken;