import { Request, Response, NextFunction } from 'express'
import jwt from '../helpers/jwt'

interface IToken {
  name: string;
  password: string;
}

function authenticate(req: Request, res: Response, next: NextFunction) {
  const decoded = jwt.checkToken(req.headers.access_token) as IToken

  if(decoded.password === process.env.ADMIN_PASSWORD) {
    next()
  }
}

export default authenticate