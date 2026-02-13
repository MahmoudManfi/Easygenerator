import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants';
import { isProduction } from '../utils/env.util';
import { UserResponse } from './types/auth.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
          },
          required: ['email', 'name'],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { access_token, user } = await this.authService.signUp(signUpDto);
    this.setAuthCookie(res, access_token);
    return res.status(HttpStatus.CREATED).json({
      user,
    });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
          },
          required: ['email', 'name'],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { access_token, user } = await this.authService.signIn(signInDto);
    this.setAuthCookie(res, access_token);
    return res.status(HttpStatus.OK).json({
      user,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed out',
  })
  logout(@Res() res: Response) {
    this.clearAuthCookie(res);
    return res.status(HttpStatus.OK).json({
      message: 'User successfully signed out',
    });
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'User is authenticated',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
          },
          required: ['email', 'name'],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'User is not authenticated' })
  checkAuth(
    @Request()
    req: ExpressRequest & { user: UserResponse },
  ) {
    return { user: req.user };
  }

  /**
   * Gets the cookie options for authentication cookies
   * @returns Cookie options object
   */
  private getCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict';
    path: string;
  } {
    return {
      httpOnly: true,
      secure: isProduction(),
      sameSite: isProduction() ? 'strict' : 'lax',
      path: '/',
    };
  }

  /**
   * Sets an httpOnly cookie with the JWT token
   * @param res - Express response object
   * @param token - JWT token to store in cookie
   */
  private setAuthCookie(res: Response, token: string): void {
    res.cookie(AUTH_COOKIE_NAME, token, {
      ...this.getCookieOptions(),
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Clears the authentication cookie
   * @param res - Express response object
   */
  private clearAuthCookie(res: Response): void {
    res.clearCookie(AUTH_COOKIE_NAME, this.getCookieOptions());
  }
}
