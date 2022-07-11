import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { decode } from '../utils/jwt.util';
import { reIssueAccessToken } from '../services/session.service';
import expressAsyncHandler from 'express-async-handler';
import Session from '../models/session.model';

const deserializeUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, 'headers.authorization', '').replace(
      /^Bearer\s/,
      ''
    );

    const refreshToken = get(req, 'headers.x-refresh');

    if (!accessToken) return next();

    const { decoded, expired } = decode(accessToken);

    if (decoded) {
      const session = await Session.findById(get(decoded, 'session'));

      if (!session || !session?.valid) return next();

      //@ts-ignore
      req.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });

      if (newAccessToken) {
        res.setHeader('x-access-token', newAccessToken);

        const { decoded } = decode(newAccessToken);
        //@ts-ignore
        req.user = decoded;
      }
      //burada sadece şeyden emşn değilim belki videonun ilerleyen kısımlarında vardır new access token oluşmaz sa ne olacak hata döndürmemiz falan gerekmez mi
      return next();
    }
    return next();
  }
);

export default deserializeUser;
