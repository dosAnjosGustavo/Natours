import { Request } from 'express';
import { UserDocument } from '../models/userModel';

export type CustomRequest = Request & {
  user?: UserDocument & {
    id?: string;
    email?: string;
  };
  body?: any;
  files?: any;
};

export type UserDocument = {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  photo: string;
  role: Role;
  password: string | undefined;
  booking?: [mongoose.Schema.Types.ObjectId];
  passwordConfirm?: string;
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
