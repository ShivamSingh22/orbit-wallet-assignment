export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (error: any) => {
    if (error instanceof AppError) {
        return { statusCode: error.statusCode, message: error.message };
    }
    return { statusCode: 500, message: 'Internal Server Error' };
}; 