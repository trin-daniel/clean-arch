import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey-result/load-survey-result-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
        private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  public async load (surveyId:string):Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return null
  }
}
