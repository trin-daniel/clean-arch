import { Encrypter } from '../../data/protocols/encrypter'
import { hash } from 'bcrypt'
export class BcryptAdapter implements Encrypter {
  constructor (
    private readonly salt:number
  ) {
    this.salt
  }

  public async encrypt (value:string): Promise<string> {
    await hash(value, this.salt)
    return ''
  }
}
