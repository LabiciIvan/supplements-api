import express        from 'express'
import cookieParser   from 'cookie-parser';
import router         from './core/router';
import cors           from 'cors';

import { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// THE allowance CORS for the client side of this application.
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
}));

app.use('/api', router);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: 'Invalid application route.',
  });
  return;
});

export default app;