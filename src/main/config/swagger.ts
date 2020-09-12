import { serve, setup } from 'swagger-ui-express'

import { Express } from 'express'
import { docs } from '@main/docs'
import { noCache } from '@main/middlewares/no-cache'

export const setupSwagger = (app: Express): void => {
  app.use('/docs', noCache, serve, setup(docs))
}
