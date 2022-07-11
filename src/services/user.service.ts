import { DocumentDefinition, FilterQuery } from 'mongoose';
import User, { UserDocument } from '../models/user.model';
import { omit } from 'lodash';

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
  return await User.create(input);
};

export const findUser = (query: FilterQuery<UserDocument>) => {
  return User.findOne(query).lean();
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: UserDocument['email'];
  password: string;
}) => {
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), 'password');
};
