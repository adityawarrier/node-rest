import { HttpStatusCode } from "./constants";

export class AppError extends Error {
  statusCode: HttpStatusCode;
  status: string;
  isOperational: boolean;
  
  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { HttpStatusCode } from './constants';
export { catchAsync } from './CatchAsync';
