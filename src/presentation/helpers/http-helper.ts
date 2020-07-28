import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})

export const success = (data:{[key:string]:any}): HttpResponse => ({
  statusCode: 200,
  body: data
})
