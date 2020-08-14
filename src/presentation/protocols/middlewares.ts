import { HttpResponse, HttpRequest } from './http'

export interface Middleware {
  handle(request: HttpRequest):Promise<HttpResponse>
}
