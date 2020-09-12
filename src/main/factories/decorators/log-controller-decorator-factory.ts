import { Controller } from '@presentation/protocols'
import { LogControllerDecorator } from '@main/decorators/log-controller-decorator'
import { LogMongoRepository } from '@infra/db/mongodb/log/log-mongo-repository'

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  return new LogControllerDecorator(controller, new LogMongoRepository())
}
