import app from '@main/config/app'
import { env } from '@main/config/env'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

let surveys: Collection
let accounts:Collection

const makeAccessToken = async ():Promise<string> => {
  const account = await accounts.insertOne({
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password',
    role: 'admin'
  })
  const id = account.ops[0]._id
  const accessToken = sign({ id }, env.secret)
  await accounts.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('AddSurvey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveys = await MongoHelper.getCollection('surveys')
    accounts = await MongoHelper.getCollection('accounts')
    await surveys.deleteMany({})
    await accounts.deleteMany({})
  })

  describe('POST/surveys', () => {
    test('Should return 403 on add survey withdout accessToken', async () => {
      await request(app).post('/api/surveys').send({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }]
      })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            answer: 'any_answer',
            image: 'https://images.com.br/profile?image=1'
          }],
          date: new Date()
        })
        .expect(204)
    })
  })

  describe('GET/surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
