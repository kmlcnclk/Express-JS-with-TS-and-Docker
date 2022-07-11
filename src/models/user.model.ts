import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { toNumber } from 'lodash';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  if (!user.isModified('password')) return next();

  const saltWorkFactor = toNumber(process.env.SALT_WORK_FACTOR) as number;

  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>('user', UserSchema);

export default User;
