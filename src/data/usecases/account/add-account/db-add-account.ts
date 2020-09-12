import
{
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  Hasher
} from './db-add-account-protocols'
import { LoadAccountByEmailRepository } from '@data/usecases/account/authentication/db-authentication-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add (data: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email)
    if (!account) {
      const hash = await this.hasher.hash(data.password)
      const accountWithPasswordEncrypted = { ...data, password: hash }
      const account = await this.addAccountRepository.add(accountWithPasswordEncrypted)
      return account
    }
    return null
  }
}
