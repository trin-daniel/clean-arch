import { NextFunction, Request, Response } from 'express'

import { Middleware } from '@presentation/protocols'

export const ExpressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { headers } = req
    const httpResponse = await middleware.handle({ headers })
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ Error: httpResponse.body.message })
    }
  }
}
