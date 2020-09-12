import { AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from '@infra/db/mongodb/survey/survey-mongo-repository'

const makeSystemUnderTest = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurveys = (): AddSurveyParams[] => {
  return [
    {
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
          image: 'any_image',
        },
      ],
      date: new Date(),
    },
    {
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer',
          image: 'other_image',
        },
      ],
      date: new Date(),
    },
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
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
          {
            answer: 'other_answer',
          },
        ],
        date: new Date(),
      })
      const survey = await surveyCollection.findOne({
        question: 'any_question',
      })
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
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should load empty list', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const surveys = await systemUnderTest.loadAll()

      expect(surveys.length).toBe(0)
    })
  })

  describe('SurveyMongoRepository method loadById', () => {
    test('Should load survey by id on success', async () => {
      const result = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
      })
      const id = result.ops[0]._id
      const systemUnderTest = makeSystemUnderTest()
      const survey = await systemUnderTest.loadById(id)

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
