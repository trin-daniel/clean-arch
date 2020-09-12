import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { DbLoadAccountByToken } from '@data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import { LoadAccountByToken } from '@domain/usecases/account/load-account-by-token'
import { env } from '@main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  return new DbLoadAccountByToken(
    new JwtAdapter(env.secret),
    new AccountMongoRepository(),
  )
}
