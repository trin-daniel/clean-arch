import {
  AddSurvey,
  AddSurveyParams,
  AddSurveyRepository,
} from '@data/usecases/survey/add-survey/db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  public async add(data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
