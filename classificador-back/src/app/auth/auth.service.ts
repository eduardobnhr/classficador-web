import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/entities/user.entity';
import { UserToken } from 'src/models/interfaces/auth/UserToken';
import { userPayload } from 'src/models/interfaces/auth/userPayload';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  login(user: User): UserToken {
    const payload: userPayload = {
      sub: user.id,
      nome: user.name,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usuarioService.findOneByEmail(email);

    if (!user) throw new UnauthorizedException('Credenciais inválidas!');

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas!');

    const newObjectReturn = {
      ...user,
      password_hash: undefined,
    };

    return newObjectReturn;
  }
}
