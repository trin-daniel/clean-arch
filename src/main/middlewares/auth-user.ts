import { ExpressMiddlewareAdapter } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export const authUser = ExpressMiddlewareAdapter(makeAuthMiddleware())
