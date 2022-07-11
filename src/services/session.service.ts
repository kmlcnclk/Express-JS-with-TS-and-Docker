import { FilterQuery, UpdateQuery } from 'mongoose';
import Session, { SessionDocument } from '../models/session.model';
// import { UserDocument } from '../models/user.model';
// import { LeanDocument } from 'mongoose';
import { sign, decode } from '../utils/jwt.util';
import { get } from 'lodash';
import { findUser } from './user.service';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
};

export const createAccessToken = async ({ user, session }: any) => {
  const accessTokenTtl = process.env.ACCESS_TOKEN_TTL as string;

  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: accessTokenTtl }
  );

  return accessToken;
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, '_id')) return false;

  const session = await Session.findById(get(decoded, '_id'));

  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return Session.updateOne(query, update);
};

export const findSessions = (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean();
};
