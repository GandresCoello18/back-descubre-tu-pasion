import { Request, Response } from 'express';
import { format } from 'date-fns';
import Locale from 'date-fns/locale/es';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { GetUsersStorage, NewUsersStorage } from '../../sql/users';
import { User } from '../../models/user';
import { config } from '../../sql';

export const getMe = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'getMe' });
  req.logger.info({ status: 'start' });

  try {
    const user = req.user;
    user.created_at = format(new Date(user.created_at), 'PPPP', { locale: Locale });
    return res.status(200).json({ me: user });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500 });
    return res.status(404).json();
  }
};

export const login = async (req: Request, res: Response) => {
  req.logger = req.logger.child({ service: 'users', serviceHandler: 'login' });
  req.logger.info({ status: 'start' });

  try {
    const { email, userName, avatar } = req.body;

    if (!email) {
      const response = { status: 'No data email provider' };
      req.logger.warn(response);
      return res.status(400).json(response);
    }

    const userExist = await GetUsersStorage({ email });
    let user: User;

    if (!userExist.length) {
      user = {
        idUser: uuidv4(),
        userName,
        email,
        active: 1,
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        avatar: avatar || null,
      };

      await NewUsersStorage(user);
    } else {
      user = userExist[0];
    }

    const me = {
      user,
      token: jwt.sign({ idUser: user.idUser }, config.JWT_SECRET, { expiresIn: '3h' }),
    };

    return res.status(200).json({ me });
  } catch (error) {
    req.logger.error({ status: 'error', code: 500, error: error.message });
    return res.status(500).json();
  }
};
