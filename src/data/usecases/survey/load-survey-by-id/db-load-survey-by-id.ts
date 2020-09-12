import {
  LoadSurveyById,
  LoadSurveyByIdRepository,
  SurveyModel,
} from '@data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  public async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
