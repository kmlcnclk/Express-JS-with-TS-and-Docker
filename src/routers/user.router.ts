import express, { Router } from 'express';
import { createUserHandler } from '../controllers/user.controller';
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from '../controllers/session.controller';
import { validateRequest, requiresUser } from '../middlewares';
import {
  createUserSchema,
  createUserSessionSchema,
} from '../schemas/user.schema';

const userRouter: Router = express.Router();

// userRouter.post('/healthcheck', createUserHandler);

userRouter.post(
  '/create',
  validateRequest(createUserSchema),
  createUserHandler
);

userRouter.post(
  '/sessions',
  validateRequest(createUserSessionSchema),
  createUserSessionHandler
);

userRouter.get('/sessions', requiresUser, getUserSessionsHandler);

userRouter.delete('/sessions', requiresUser, invalidateUserSessionHandler);

export default userRouter;