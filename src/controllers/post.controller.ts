import expressAsyncHandler from 'express-async-handler';
import { get } from 'lodash';
import {
  createPost,
  findPost,
  findAndUpdate,
  deletePost,
} from '../services/post.service';
import { Request, Response } from 'express';

export const createPostHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const userId = get(req, 'user._id');
    const body = req.body;

    const post = await createPost({ ...body, user: userId });

    return res.status(201).json(post);
  }
);

export const updatePostHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const postId = get(req, 'params.postId');
    const userId = get(req, 'user._id');
    const update = req.body;

    const post = await findPost({ _id: postId });

    if (!post) return res.sendStatus(404);

    if (String(post.user) !== String(userId)) return res.sendStatus(401);

    const updatedPost = await findAndUpdate({ _id: postId }, update, {
      new: true,
    });

    return res.send(updatedPost);
  }
);

export const getPostHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const postId = get(req, 'params.postId');

    const post = await findPost({ _id: postId });

    if (!post) return res.sendStatus(404);

    return res.send(post);
  }
);

export const deletePostHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const postId = get(req, 'params.postId');
    const userId = get(req, 'user._id');

    const post = await findPost({ _id: postId });

    if (!post) return res.sendStatus(404);

    if (String(post.user) !== String(userId)) return res.sendStatus(401);

    await deletePost({ _id: postId });

    return res.sendStatus(200);
  }
);
