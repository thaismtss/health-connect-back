export interface Response<D> {
  success: boolean;
  data: D;
}

export interface ResponseLogin
  extends Response<{
    accessToken: string;
  }> {}
