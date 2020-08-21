import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyById } from '../../../domain/usecases/load-survey-by-id'
import { LoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  public async loadById (id: string):Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
