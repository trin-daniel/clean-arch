import { Collection } from 'mongodb'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import app from '@main/config/app'
import { env } from '@main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

let accounts: Collection
let surveys: Collection

const makeAccessToken = async (): Promise<string> => {
  const account = await accounts.insertOne({
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password',
  })
  const id = account.ops[0]._id
  const accessToken = sign({ id }, env.secret)
  await accounts.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        accessToken,
      },
    },
  )
  return accessToken
}

describe('Survey Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: '',
        })
        .expect(403)
    })

    test('Should return 200 on success survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const response = await surveys.insertOne({
        question: 'valid_question',
        answers: [
          {
            answer: 'valid_answer',
            image: 'valid_image',
          },
          { answer: 'other_answer' },
        ],
        date: new Date(),
      })
      await request(app)
        .put(`/api/surveys/${response.ops[0]._id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'valid_answer',
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403)
    })

    test('Should return 200 on load survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const response = await surveys.insertOne({
        question: 'valid_question',
        answers: [
          {
            answer: 'valid_answer',
            image: 'valid_image',
          },
          { answer: 'other_answer' },
        ],
        date: new Date(),
      })
      await request(app)
        .get(`/api/surveys/${response.ops[0]._id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
