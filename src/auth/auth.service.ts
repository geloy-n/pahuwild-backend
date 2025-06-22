import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserTokenPayload } from './token-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(
          this.configService.getOrThrow<string>(
            'JWT_EXPIRATION',
          ) as unknown as ms.StringValue,
        ),
    );

    const tokenPayload: UserTokenPayload = {
      userId: user.id,
      role: user.role,
    };
    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: false,
      httpOnly: true,
      expires,
    });

    return { tokenPayload };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
