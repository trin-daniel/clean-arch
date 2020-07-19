export interface Request{
  body: {
    [key: string]:any,
  };
}

export interface Response{
  statusCode: number;
  body?: {
    [key: string]:any,
  };
}
