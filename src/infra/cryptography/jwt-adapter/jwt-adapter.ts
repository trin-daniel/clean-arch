import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret:string
  ) {
    this.secret
  }

  public async encrypt (value:string):Promise<string> {
    await jwt.sign({ id: value }, this.secret)
    return null
  }
}
