import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: (null as unknown) as MongoClient,
  uri: (null as unknown) as string,
  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  },
  async disconnect(): Promise<void> {
    await this.client.close(true)
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },
  map(data: { [key: string]: any }): any {
    const { _id: id, ...rest } = data
    return { id, ...rest }
  },
  mapCollection: (collection: any[]): any[] => {
    return collection.map((item) => MongoHelper.map(item))
  },
}
