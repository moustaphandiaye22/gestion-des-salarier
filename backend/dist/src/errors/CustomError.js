export class CustomError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends CustomError {
    constructor(message = 'Erreur de validation des données', details) {
        super(message, 400, details);
    }
}
export class AuthenticationError extends CustomError {
    constructor(message = 'Erreur d\'authentification') {
        super(message, 401);
    }
}
export class AuthorizationError extends CustomError {
    constructor(message = 'Accès non autorisé') {
        super(message, 403);
    }
}
export class NotFoundError extends CustomError {
    constructor(resource = 'Ressource') {
        super(`${resource} introuvable`, 404);
    }
}
export class ConflictError extends CustomError {
    constructor(message = 'Conflit de données') {
        super(message, 409);
    }
}
export class InternalServerError extends CustomError {
    constructor(message = 'Erreur interne du serveur') {
        super(message, 500);
    }
}
//# sourceMappingURL=CustomError.js.map