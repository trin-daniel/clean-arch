import { readdirSync } from 'fs'
import { Express, Router } from 'express'

export const setupRoutes = (app: Express):void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
