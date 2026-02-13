import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { getJwtSecret } from '../utils/env.util';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants';
import { UserResponse } from './types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Get token from httpOnly cookie
          if (
            request?.cookies?.[AUTH_COOKIE_NAME] &&
            typeof request.cookies[AUTH_COOKIE_NAME] === 'string'
          ) {
            return request.cookies[AUTH_COOKIE_NAME];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: { sub: string }): Promise<UserResponse> {
    const userId = payload.sub;
    const user = await this.authService.validateUser(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { email: user.email, name: user.name };
  }
}
