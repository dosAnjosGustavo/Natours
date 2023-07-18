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

type Tour = TourBasicSchema & { id: number };

type TourSchema = mongoose.Document &
  TourBasicSchema & {
    priceDiscount?: number;
    createdAt: Date;
  };

type AppErrorType = {
  statusCode: number;
  status: string;
  message: string;
  isOperational: boolean;
  stack: string;
  name: string;
  value: string;
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
