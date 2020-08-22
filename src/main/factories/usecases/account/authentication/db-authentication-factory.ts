import { env } from '../../../../config/env'
import { DbAuthentication } from '../../../../../data/usecases/account/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { Authentication } from '../../../../../domain/usecases/account/authentication'

export const makeDbAuthentication = ():Authentication => {
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(12),
    new JwtAdapter(env.secret),
    new AccountMongoRepository()
  )
}
