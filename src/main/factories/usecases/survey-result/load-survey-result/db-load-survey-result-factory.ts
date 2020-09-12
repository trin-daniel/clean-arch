import { SaveSurveyResult } from '../../../../../domain/usecases/survey-result/save-survey-result'
import { DbLoadSurveyResult } from '../../../../../data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey-result/survey-result-mongo-respository'
import { LoadSurveyResult } from '../../../../../domain/usecases/survey-result/load-survey-result'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  return new DbLoadSurveyResult(
    new SurveyResultMongoRepository(),
    new SurveyMongoRepository()
  )
}
