import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('AddSurvey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

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
})
