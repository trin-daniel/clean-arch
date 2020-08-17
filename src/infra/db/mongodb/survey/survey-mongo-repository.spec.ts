import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

const makeSystemUnderTest = ():SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurveys = (): AddSurveyModel[] => {
  return [
    {
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      }],
      date: new Date()
    },
    {
      question: 'other_question',
      answers: [{
        answer: 'other_answer',
        image: 'other_image'
      }],
      date: new Date()
    }
  ]
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

  describe('SurveyMongoRepository method loadAll', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany(makeFakeSurveys())
      const systemUnderTest = makeSystemUnderTest()
      const surveys = await systemUnderTest.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })
})
