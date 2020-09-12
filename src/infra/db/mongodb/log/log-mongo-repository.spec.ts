import { Collection } from 'mongodb'
import { LogMongoRepository } from '@infra/db/mongodb/log/log-mongo-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let error: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    error = await MongoHelper.getCollection('errors')
    await error.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await error.countDocuments()
    expect(count).toBe(1)
  })
})
