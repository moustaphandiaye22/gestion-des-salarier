export class CustomError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Erreur de validation des données', details?: any) {
    super(message, 400, details);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Erreur d\'authentification') {
    super(message, 401);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Accès non autorisé') {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Ressource') {
    super(`${resource} introuvable`, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Conflit de données') {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Erreur interne du serveur') {
    super(message, 500);
  }
}
