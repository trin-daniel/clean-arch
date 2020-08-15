import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter : Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  public async load (token: string, role?:string):Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(token)
    if (decryptedToken) {
      await this.loadAccountByTokenRepository.loadByToken(token, role)
    }
    return null
  }
}
