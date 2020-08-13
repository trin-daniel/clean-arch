import
{
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher
} from './db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add (data: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(data.email)
    const hash = await this.hasher.hash(data.password)
    const accountWithPasswordEncrypted = { ...data, password: hash }
    const account = await this.addAccountRepository.add(accountWithPasswordEncrypted)
    return new Promise(resolve => resolve(account))
  }
}
