import { Request, Response, NextFunction, RequestHandler } from 'express';
import { omit } from 'lodash';
import { createUser } from '../services/user.service';
// import log from '../logger';
import User from '../models/user.model';
import CustomError from '../errors/CustomError';
import expressAsyncHandler from 'express-async-handler';

export const createUserHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), 'password'));
  }
);
