import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'

let accountCollection: Collection
describe('Account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSystemUnderTest = ():AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('AccountMongoRepository method add', () => {
    test('Should return an account on add success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const account = await systemUnderTest.add({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('AccountMongoRepository method loadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      })
      const account = await systemUnderTest.loadByEmail('any_email@gmail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const account = await systemUnderTest.loadByEmail('any_email@gmail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('AccountMongoRepository method updateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      })
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()

      await systemUnderTest.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('AccountMongoRepository method loadByToken', () => {
    test('Should return an account on loadByToken withdout role', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await systemUnderTest.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await systemUnderTest.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await systemUnderTest.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await systemUnderTest.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByToken fails', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const account = await systemUnderTest.loadByToken('any_token')

      expect(account).toBeFalsy()
    })
  })
})
