import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
        private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
        private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  public async load (surveyId:string):Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }
    return surveyResult
  }
}
