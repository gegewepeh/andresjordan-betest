import { Request, Response, NextFunction } from 'express'
import jwt from '../helpers/jwt'
import IAdmin from '../interfaces/admin_interface'
import IResponseObject from '../interfaces/response_interface'

export default {
  generateJWT
}

async function generateJWT(req: Request, res: Response, next: NextFunction) {
  const requestInput = req.body as IAdmin
  let responseObject: IResponseObject

  if (requestInput.password !== process.env.ADMIN_PASSWORD) {
    responseObject = {
      httpStatus: 401,
      payload: { message: 'Invalid password' }
    }
  } else {
    const generatedToken = jwt.generateToken(requestInput)

    responseObject = {
      httpStatus: 201,
      payload: { message: 'Token created', token: generatedToken }
    }
  }

  res.status(responseObject.httpStatus).send(responseObject.payload)
}
