import { Request } from 'express';
import { UserDocument } from '../models/userModel';

export type CustomRequest = Request & {
  user?: any;
  body?: any;
  files?: any;
};
