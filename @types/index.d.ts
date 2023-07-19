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

// Tour
type TourTypeBlueprint = {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
};

type Tour = TourTypeBlueprint & { id: number };

type TourSchema = mongoose.Document &
  TourTypeBlueprint & {
    priceDiscount?: number;
    createdAt: Date;
  };

// User, Authentication and Authorization
type User = {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
};

type UserSchema = mongoose.Document & User;

type JWTLoginType = {
  id: string;
  iat: number;
  exp: number;
};
