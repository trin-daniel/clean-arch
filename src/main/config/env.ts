export const env = {
  mongoURL: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 3333,
  secret: process.env.SECRET_KEY || 'QXV9UG7L'
}
