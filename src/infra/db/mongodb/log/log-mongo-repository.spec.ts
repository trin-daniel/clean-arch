import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-mongo-repository'
declare const process:{
  env:{
    MONGO_URL:string
  }
}

const makeSystemUnderTest = ():LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection:Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('Should create an error log on success', async () => {
    const systemUnderTest = makeSystemUnderTest()
    await systemUnderTest.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
