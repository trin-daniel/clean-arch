import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'

export class AccountMongoRepository implements
AddAccountRepository,
LoadAccountByEmailRepository,
UpdateAccessTokenRepository,
LoadAccountByTokenRepository {
  public async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const result = await collection.insertOne(account)
    return MongoHelper.map(result.ops[0])
  }

  public async loadByEmail (email:string):Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne<AccountModel>({ email })
    return account && MongoHelper.map(account)
  }

  public async updateAccessToken (id:string, token:string):Promise<void> {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }

  public async loadByToken (token:string, role?:string):Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne({
      accessToken: token,
      role
    })
    return account && MongoHelper.map(account)
  }
}
