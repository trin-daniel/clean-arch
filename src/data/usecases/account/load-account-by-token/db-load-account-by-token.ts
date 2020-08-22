import {
  AccountModel,
  Decrypter,
  LoadAccountByToken,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter : Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  public async load (token: string, role?:string):Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(token)
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
