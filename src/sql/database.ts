/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql from 'mysql';
// import { config } from './config';

const conectar = () => {
  const connection = mysql.createConnection({
    host: 'localhost', //config.DB_HOST,
    user: 'root', //config.DB_USER,
    password: '', //config.DB_PASSWORD,
    database: 'gamafica', //config.DB_NAME,
    // port: config.DB_PORT,
    charset: 'utf8mb4_general_ci',
  });

  try {
    connection.connect();
    console.log('conectado mysql con exito');

    connection.on('err', (err: any) => {
      if (err) console.log(err);
    });

    return connection;
  } catch (error) {
    connection.end();
    return connection;
  }
};

export const dataBase = conectar();
