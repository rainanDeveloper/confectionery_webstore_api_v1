import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async login(user: UserEntity) {
    const payload: JwtPayloadDto = {
      sub: user.id,
      login: user.login,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(login: string, password: string) {
    let user;

    try {
      user = await this.userService.findOneByEmailOrLogin(login);
    } catch (error) {
      return null;
    }

    const passwordIsValid = compareSync(password, user.password);

    if (!passwordIsValid) return null;

    return user;
  }
}
