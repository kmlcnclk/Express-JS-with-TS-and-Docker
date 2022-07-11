import expressAsyncHandler from 'express-async-handler';
import { validatePassword } from '../services/user.service';
import { Request, Response } from 'express';
import CustomError from '../errors/CustomError';
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions
} from '../services/session.service';
import { sign } from '../utils/jwt.util';
import { get } from 'lodash';

export const createUserSessionHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const user = await validatePassword(req.body);

    if (!user)
      throw new CustomError('Unauthorized', 'Invalid email or password', 401);

    const session = await createSession(user._id, req.get('user-agent') || '');

    const accessToken = await createAccessToken({
      user,
      session,
    });

    const refreshToken = await sign(session, {
      expiresIn: process.env.REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  }
);

export const invalidateUserSessionHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const sessionId = get(req, 'user.session');

    await updateSession({ _id: sessionId }, { valid: false });

    return res.sendStatus(200);
  }
);

export const getUserSessionsHandler = expressAsyncHandler(
  //@ts-ignore
  async (req: Request, res: Response) => {
    const userId = get(req, 'user._id');

    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
  }
);
