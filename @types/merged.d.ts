import { Request } from 'express';

export type CustomRequest = Request & {
  user?: any;
};
