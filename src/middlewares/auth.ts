/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { config } from '../sql';
import { getUserStorage } from '../sql/users';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

interface TokenInterface {
  idUser: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('auth start');

  try {
    const token: string | undefined = req.header('access-token');

    if (!token) {
      throw new Error('Please authenticate');
    }

    jwt.verify(token, config.JWT_SECRET, async (err: any, decoded: TokenInterface) => {
      if (err) {
        throw new Error('Please authenticate.');
      } else {
        const user = await getUserStorage({ idUser: decoded.idUser });

        if (!user.length) {
          throw new Error('No existe el usuario');
        }

        if (!user[0].active) {
          throw new Error('Usuario inactivo');
        }

        req.user = user[0];
        next();
      }
    });
  } catch (error) {
    console.log('auth error', error.message);
    res.status(401).json({ status: error.message });
  }
};
