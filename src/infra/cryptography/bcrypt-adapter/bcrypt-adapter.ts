import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { Hasher } from '@data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  public async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    const available = await bcrypt.compare(value, hash)
    return available
  }
}
