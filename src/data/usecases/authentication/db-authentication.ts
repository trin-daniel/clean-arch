import
{
  Authentication,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository,
    private readonly hashComparer:HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository:UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository
    this.hashComparer
    this.encrypter
    this.updateAccessTokenRepository
  }

  public async auth (authentication:AuthenticationModel):Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const available = await this.hashComparer.compare(authentication.password, account.password)
      if (available) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
