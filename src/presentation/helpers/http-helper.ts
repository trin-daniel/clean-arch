import { Response } from '../protocols/http'
import { ServerError } from '../errors'
export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})

export const serverError = (): Response => ({
  statusCode: 500,
  body: new ServerError()
})

export const success = (data:{[key:string]:any}): Response => ({
  statusCode: 200,
  body: data
})
