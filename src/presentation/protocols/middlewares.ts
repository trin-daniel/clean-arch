import { HttpRequest, HttpResponse } from '@presentation/protocols/http'

export interface Middleware {
  handle(request: HttpRequest): Promise<HttpResponse>
}
