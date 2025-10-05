export declare const createErrorResponse: (error: string, message: string, status?: number, details?: any) => {
    error: string;
    message: string;
    success: boolean;
    details: any;
    timestamp: string;
};
export declare const createSuccessResponse: (message: string, data?: any) => {
    message: string;
    success: boolean;
    data: any;
    timestamp: string;
};
export declare const createValidationErrorResponse: (errors: any[]) => {
    error: string;
    message: string;
    success: boolean;
    details: any;
    timestamp: string;
};
export declare const HttpStatus: {
    OK: number;
    CREATED: number;
    NO_CONTENT: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    INTERNAL_SERVER_ERROR: number;
};
//# sourceMappingURL=httpStatus.d.ts.map