import { AddAccount } from '@domain/usecases/account/add-account'
import { DbAddAccount } from '@data/usecases/account/add-account/db-add-account'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'

export const makeDbAddAccount = ():AddAccount => {
  return new DbAddAccount(
    new BcryptAdapter(12),
    new AccountMongoRepository(),
    new AccountMongoRepository()
  )
}
