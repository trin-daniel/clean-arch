import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { env } from '../config/env'

let surveys: Collection
let accounts:Collection

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
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            answer: 'any_answer',
            image: 'https://images.com.br/profile?image=1'
          }]
        })
        .expect(204)
    })
  })
})
