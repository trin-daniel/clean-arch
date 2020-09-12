import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { Authentication } from '@domain/usecases/account/authentication'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { DbAuthentication } from '@data/usecases/account/authentication/db-authentication'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import { env } from '@main/config/env'

export const makeDbAuthentication = (): Authentication => {
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(12),
    new JwtAdapter(env.secret),
    new AccountMongoRepository(),
  )
}
