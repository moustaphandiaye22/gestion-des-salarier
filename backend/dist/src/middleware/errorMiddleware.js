import { CustomError } from '../errors/CustomError.js';
import { Logger } from '../utils/logger.js';
export const errorHandler = (err, req, res, next) => {
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
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=errorMiddleware.js.map