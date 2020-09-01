import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash_final')
  },
  async compare ():Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const salt = 12

const makeSut = ():BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Cryptographic password layer', () => {
  describe('BcryptAdpter method hash', () => {
    test('Should call hash with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash_final')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))

      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('BcryptAdpter method compare', () => {
    test('Should call compare with correct value', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const available = await sut.compare('any_value', 'any_hash')

      expect(available).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))

      const available = await sut.compare('any_value', 'any_hash')
      expect(available).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.reject(new Error()))

      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
