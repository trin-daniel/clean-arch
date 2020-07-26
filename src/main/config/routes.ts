import { Express, Router } from 'express'
import fs from 'fast-glob'

export const setupRoutes = (app: Express):void => {
  const router = Router()
  app.use('/api', router)
  fs.sync('**/src/main/routes/**routes.ts')
    .map(async file => (await import(`../../../${file}`)).default(router))
}
