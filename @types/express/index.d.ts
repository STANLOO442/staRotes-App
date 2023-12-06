// @types/express/index.d.ts

import { User } from '../../model/user';

declare namespace Express {
  interface Request {
    user?: User;
  }
}
