export interface HttpRequest{
  body?: {
    [key: string]:any,
  }
  headers?:any
}

export interface HttpResponse{
  statusCode: number;
  body?: {
    [key: string]:any,
  };
}
