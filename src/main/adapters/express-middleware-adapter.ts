import { Middleware } from '../../presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const ExpressMiddlewareAdpter = (middleware: Middleware) => {
  return async (req: Request, res:Response, next: NextFunction) => {
    const { headers } = req
    const httpResponse = await middleware.handle({ headers })
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({ Error: httpResponse.body.message })
    }
  }
}
