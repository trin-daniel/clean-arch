import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '../../../../../domain/usecases/add-account'
import { DbAddAccount } from '../../../../../data/usecases/add-account/db-add-account'

export const makeDbAddAccount = ():AddAccount => {
  return new DbAddAccount(
    new BcryptAdapter(12),
    new AccountMongoRepository(),
    new AccountMongoRepository()
  )
}
