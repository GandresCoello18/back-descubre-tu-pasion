import express from 'express';
import cors from 'cors';
import { logger } from './middlewares';
import User from './services/users';

import { config } from './sql';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://gamification-kappa.vercel.app',
    ],
  }),
);

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/static', express.static('public'));
app.set('port', config.APP_PORT);

app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe' || req.originalUrl === '/api/v2/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

export const App = app;

app.use('/api', logger, [User]);

app.listen(app.get('port'), () => {
  console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
});

// ConfigSocketIo(server);
