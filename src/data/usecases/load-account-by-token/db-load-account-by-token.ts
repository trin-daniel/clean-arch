import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/cryptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter : Decrypter
  ) {}

  public async load (token: string, role?:string):Promise<AccountModel> {
    await this.decrypter.decrypt(token)
    return null
  }
}
