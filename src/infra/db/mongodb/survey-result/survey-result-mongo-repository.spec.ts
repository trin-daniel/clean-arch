import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-respository'
import { AccountModel } from '../../../../domain/models/account'
import { SurveyModel } from '../../../../domain/models/survey'
import { Collection, ObjectId } from 'mongodb'

const makeSystemUnderTest = ():SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const result = await surveyCollection.insertOne(
    {
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      }, {
        answer: 'other_answer',
        image: 'other_image'
      }],
      date: new Date()
    }
  )
  return MongoHelper.map(result.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password'
  })
  return MongoHelper.map(account.ops[0])
}

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResultMongoRepository method save', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const systemUnderTest = makeSystemUnderTest()

      const surveyResult = await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })

    test('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const systemUnderTest = makeSystemUnderTest()

      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const surveyResult = await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })
  })
})
