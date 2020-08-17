import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'

const makeSystemUnderTest = ():SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
describe('SurveyMongoRepository', () => {
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

  describe('SurveyMongoRepository method add', () => {
    test('Should add a survey on success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await systemUnderTest.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
})
