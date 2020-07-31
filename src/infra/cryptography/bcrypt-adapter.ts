import { Encrypter } from '../../data/protocols/cryptography/encrypter'
import bcrypt from 'bcrypt'
export class BcryptAdapter implements Encrypter {
  constructor (
    private readonly salt:number
  ) {
    this.salt
  }

  public async encrypt (value:string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
