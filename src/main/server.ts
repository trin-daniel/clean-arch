import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import { connection } from './config/env'

MongoHelper.connect(connection.mongoURL)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(connection.port, () => console.log(`Server is Running, http://localhost:${connection.port}`))
  })
  .catch(err => { console.error(err) })
