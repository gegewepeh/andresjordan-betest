import { ErrorRequestHandler } from 'express';
import IError from '../interfaces/error_interface'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error: IError

  if (err.httpStatus) {
    error = {
      httpStatus: err.httpStatus,
      message: err.message,
      errorDetails: err.details
    }
  } else {
    error = {
      httpStatus: 500,
      message: 'Internal Server Error',
      errorDetails: err
    }
  }

  if (err.code === 11000) {
    const duplicateName = Object.getOwnPropertyNames(err.keyValue)

    error.errorDetails = [{ duplicateError: `${duplicateName[0]} already exist` }]
  }

  console.log(err)
  res.status(error.httpStatus).json({
    path: req.originalUrl,
    method: req.method,
    errorMessage: error.message,
    errorDetails: error.errorDetails,
  })
}

export default errorHandler;