import
{
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Encrypter
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.encrypter
    this.addAccountRepository
  }

  public async add (data: AddAccountModel): Promise<AccountModel> {
    const hash = await this.encrypter.encrypt(data.password)
    const accountWithPasswordEncrypted = { ...data, password: hash }
    const account = await this.addAccountRepository.add(accountWithPasswordEncrypted)
    return new Promise(resolve => resolve(account))
  }
}