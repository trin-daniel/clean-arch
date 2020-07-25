import express from 'express'
import { setupMiddlewares } from '../config/middlewares'

export const app = express()
setupMiddlewares(app)
