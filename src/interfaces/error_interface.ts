export default interface IError {
  httpStatus: number;
  message: string;
  errorDetails?: any;
}