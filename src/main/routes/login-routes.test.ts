import { Collection } from 'mongodb'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import app from '@main/config/app'
import { hash } from 'bcrypt'
import request from 'supertest'

let accountCollection: Collection

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST/signup', () => {
    test('Should return 200 on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'valid_name',
          email: 'valid_email@gmail.com',
          password: 'valid_password',
          confirmation: 'valid_password',
        })
        .expect(200)
    })
  })

  describe('POST/signin', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password,
      })
      await request(app)
        .post('/api/signin')
        .send({
          email: 'valid_email@gmail.com',
          password: '123',
        })
        .expect(200)
    })
    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'valid_email@gmail.com',
          password: '123',
        })
        .expect(401)
    })
  })
})
