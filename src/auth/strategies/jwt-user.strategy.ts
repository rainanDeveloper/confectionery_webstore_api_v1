import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
    let user;

    const unauthorizedException =
      'Você não possui permissão para realizar essa ação';

    try {
      user = await this.userService.findOneById(payload.sub);
    } catch (error) {
      throw new UnauthorizedException(unauthorizedException);
    }

    if (!user) throw new UnauthorizedException(unauthorizedException);

    if (user.email !== payload.email)
      throw new UnauthorizedException(unauthorizedException);

    if (user.login !== payload.login)
      throw new UnauthorizedException(unauthorizedException);

    return {
      id: payload.sub,
      login: payload.login,
      email: payload.email,
    };
  }
}
