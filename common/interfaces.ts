export interface ResponseWithData<D> {
  success: boolean;
  data: D;
}

export interface Response {
  success: boolean;
}

export interface ResponseError {
  success: boolean;
  error: {
    message: string;
  };
}

export interface ResponseLogin
  extends ResponseWithData<{
    accessToken: string;
    name: string;
  }> {}

export interface IUserRequest extends Express.Request {
  user: {
    userId: string;
  };
}

export interface Glycemic {
  id: string;
  value: string;
  fasting: boolean;
  status: string;
  createdAt: Date;
  date: string;
  time: string;
}

export interface GlycemicControl {
  average: number;
  max: number;
  min: number;
  glycemic: Glycemic[];
}

export interface Services {
  id: string;
  name: string;
  description: string;
  slug: string;
}
