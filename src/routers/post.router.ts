import express, { Router } from 'express';
import { validateRequest, requiresUser } from '../middlewares';
import {createPostSchema,updatePostSchema,deletePostSchema} from '../schemas/post.schema';
import {createPostHandler,updatePostHandler,getPostHandler,deletePostHandler}from "../controllers/post.controller"

const postRouter: Router = express.Router();

postRouter.post(
  '/create',
  [requiresUser, validateRequest(createPostSchema)],
  createPostHandler
);

postRouter.put(
  '/put/:postId',
  [requiresUser, validateRequest(updatePostSchema)],
  updatePostHandler
);

postRouter.get('/get/:postId', getPostHandler);

postRouter.delete(
  '/delete/:postId',
  [requiresUser, validateRequest(deletePostSchema)],
  deletePostHandler
);

export default postRouter;
