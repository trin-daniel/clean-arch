export type HttpRequest = {
  body?: {
    [key: string]:any,
  }
  headers?:any
}

export type HttpResponse = {
  statusCode: number;
  body?: {
    [key: string]:any,
  };
}
