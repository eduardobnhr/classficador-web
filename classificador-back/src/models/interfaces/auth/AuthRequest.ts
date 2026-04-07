import type { Request } from 'express';
import { User } from 'src/models/entities/user.entity';

export interface AuthRequest extends Request {
  user: User;
}
