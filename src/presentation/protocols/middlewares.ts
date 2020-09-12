import { HttpResponse, HttpRequest } from '@presentation/protocols/http'

export interface Middleware {
  handle(request: HttpRequest):Promise<HttpResponse>
}
