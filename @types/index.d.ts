// Error
type AppErrorType = {
  statusCode: number;
  status: string;
  message: string;
  isOperational: boolean;
  stack: string;
  name: string;
  value: string;
  keyValue?: {
    name: string;
  };
  path?: string;
  errmsg?: string;
  code?: number;
  errors?: {
    name: string;
    message: string;
    kind: string;
    value: string;
    path: string;
    properties: {
      message: string;
      type: string;
      minlength: number;
      path: string;
      value: string;
    };
  };
};

type JWTLoginType = {
  id: string;
  iat: number;
  exp: number;
};
