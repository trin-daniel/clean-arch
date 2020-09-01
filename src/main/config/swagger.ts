import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { docs } from '../docs'
import { noCache } from '../middlewares/no-cache'

export const setupSwagger = (app: Express):void => {
  app.use('/docs', noCache, serve, setup(docs))
}
