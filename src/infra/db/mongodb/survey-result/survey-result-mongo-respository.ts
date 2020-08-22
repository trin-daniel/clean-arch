import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { SaveSurveyResultModel } from '../../../../domain/usecases/save-survey-result'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  public async save (data: SaveSurveyResultModel):Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const result = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return result.value && MongoHelper.map(result.value)
  }
}