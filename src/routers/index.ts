import express, { Router } from 'express';
import userRouter from './user.router';
import postRouter from './post.router';

const mainRouter: Router = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/post', postRouter);

export default mainRouter;
