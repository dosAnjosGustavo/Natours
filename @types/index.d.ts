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

// JWT
type JWTLoginType = {
  id: string;
  iat: number;
  exp: number;
};

// Tour
type TourDocument = mongoose.Document & {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  createdAt?: Date;
  startDates?: Date[];
  slug?: string;
  secretTour?: boolean;
  locations?: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  }[];
  guides?: mongoose.Schema.Types.ObjectId[];
  startLocation?: {
    type: string;
    coordinates: number[];
    description: string;
  };
};

// Review
type ReviewDocument = {
  review: string;
  rating: number;
  createdAt?: Date;
  tour: mongoose.Schema.Types.ObjectId | string;
  user: mongoose.Schema.Types.ObjectId;
};

type ReviewModel = ReviewDocument &
  mongoose.Model<ReviewDocument> & {
    calcAverageRatings: (tourId: string) => Promise<void>;
  };

// User
type Role = 'user' | 'guide' | 'lead-guide' | 'admin';

type UserDocument = {
  name: string;
  email: string;
  photo: string;
  role: Role;
  newPassword: string;
  newPasswordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  active: boolean;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
};
