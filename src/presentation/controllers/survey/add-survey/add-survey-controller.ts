import { Controller, HttpResponse, HttpRequest, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const { body } = request
    this.validation.validate(body)
    return new Promise(resolve => resolve(null))
  }
}
