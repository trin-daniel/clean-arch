import
{
  Authentication,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository,
    private readonly hashComparer:HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository:UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository
    this.hashComparer
    this.tokenGenerator
    this.updateAccessTokenRepository
  }

  public async auth (authentication:AuthenticationModel):Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const available = await this.hashComparer.compare(authentication.password, account.password)
      if (available) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
