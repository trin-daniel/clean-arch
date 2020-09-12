import { AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { SurveyModel } from '@domain/models/survey'
import { AddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { ObjectID } from 'mongodb'

export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository {
  public async add (surveyData: AddSurveyParams):Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  public async loadAll ():Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  public async loadById (id: string):Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectID(id) })
    return survey && MongoHelper.map(survey)
  }
}
