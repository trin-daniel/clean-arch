import { Collection, ObjectId } from 'mongodb'
import { reset, set } from 'mockdate'

import { AccountModel } from '@domain/models/account'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '@domain/models/survey'
import { SurveyResultMongoRepository } from '@infra/db/mongodb/survey-result/survey-result-mongo-respository'

const makeSystemUnderTest = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const mockSurvey = async (): Promise<SurveyModel> => {
  const result = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image1',
        answer: 'any_answer1',
      },
      {
        image: 'any_image2',
        answer: 'any_answer2',
      },
      {
        image: 'any_image3',
        answer: 'any_answer3',
      },
    ],
    date: new Date(),
  })
  return MongoHelper.map(result.ops[0])
}

const mockAccount = async (): Promise<AccountModel> => {
  const account = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
  })
  return MongoHelper.map(account.ops[0])
}

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    reset()
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
      const survey = await mockSurvey()
      const account = await mockAccount()
      const systemUnderTest = makeSystemUnderTest()

      await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id,
      })

      expect(surveyResult).toBeTruthy()
    })

    test('Should update survey result if its not new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const systemUnderTest = makeSystemUnderTest()

      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      })

      await systemUnderTest.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      })
      const surveyResult = await surveyResultCollection
        .find({ surveyId: survey.id, accountId: account.id })
        .toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('SurveyResutlMongoRepository method loadBySurveyId', () => {
    test('Should load survey result', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()

      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ])
      const sut = makeSystemUnderTest()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)

      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)

      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)

      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await mockSurvey()
      const sut = makeSystemUnderTest()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeNull()
    })
  })
})
