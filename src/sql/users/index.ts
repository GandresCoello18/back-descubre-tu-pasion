import { User } from '../../models/user';
import { dataBase } from '../database';

export const NewUsersStorage = async (user: User) => {
  try {
    return (await new Promise((resolve, reject) => {
      dataBase.query(
        `INSERT INTO users (idUser, created_at, active, avatar, userName, email) VALUES ('${
          user.idUser
        }', '${user.created_at}', ${user.active}, ${user.avatar ? `'${user.avatar}'` : null}, '${
          user.userName
        }', '${user.email}');`,
        err => (err ? reject(err) : resolve(user.idUser)),
      );
    })) as string;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const GetUsersStorage = async (options?: { email?: string; idUser?: string }) => {
  try {
    let find = '';

    if (options?.email) {
      find = `WHERE email = '${options?.email}'`;
    }

    if (options?.idUser) {
      find = `WHERE idUser = '${options?.idUser}'`;
    }

    return (await new Promise((resolve, reject) => {
      dataBase.query(`SELECT * FROM users ${options ? find : ''};`, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    })) as User[];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
