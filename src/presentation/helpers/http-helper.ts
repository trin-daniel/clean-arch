import { Response } from '../protocols/http'
export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})
