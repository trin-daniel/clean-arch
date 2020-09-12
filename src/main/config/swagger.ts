import { docs } from '@main/docs'
import { noCache } from '@main/middlewares/no-cache'
import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

export const setupSwagger = (app: Express):void => {
  app.use('/docs', noCache, serve, setup(docs))
}
