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
  ) {}

  public async auth (authentication:AuthenticationModel):Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const available = await this.hashComparer.compare(authentication.password, account.password)
      if (available) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
