import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError.js';
import { Logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error('Erreur capturée par le middleware', err, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
  }

  // Erreur générique
  return res.status(500).json({
    error: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.'
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
