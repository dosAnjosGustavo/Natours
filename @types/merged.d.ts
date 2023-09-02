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
