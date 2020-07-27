import { MongoHelper as systemUnderTest } from './mongo-helper'
declare const process :{
  env : {
    MONGO_URL: string
  }
}
describe('Mongo Helper', () => {
  beforeAll(async () => {
    await systemUnderTest.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await systemUnderTest.disconnect()
  })
  test('Should reconect if mongodb is down', async () => {
    let accountCollection = await systemUnderTest.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await systemUnderTest.disconnect()
    accountCollection = await systemUnderTest.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
