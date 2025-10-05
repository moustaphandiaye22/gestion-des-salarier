// Utility functions for consistent error responses
export const createErrorResponse = (error, message, status = 400, details) => ({
    error,
    message,
    success: false,
    details,
    timestamp: new Date().toISOString()
});
export const createSuccessResponse = (message, data) => ({
    message,
    success: true,
    data,
    timestamp: new Date().toISOString()
});
export const createValidationErrorResponse = (errors) => {
    const validationErrors = errors.map((error) => ({
        champ: error.path?.join('.') || 'inconnu',
        message: error.message,
        valeur: error.input
    }));
    return createErrorResponse('Données de validation invalides', 'Veuillez vérifier les informations saisies et réessayer.', 400, validationErrors);
};
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
//# sourceMappingURL=httpStatus.js.map