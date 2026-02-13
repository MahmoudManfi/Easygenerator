import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AUTH_COOKIE_NAME } from './constants/auth.constants';
import { UserResponse } from './auth/types/auth.types';

@ApiTags('Application')
@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  @ApiOperation({ summary: 'Protected endpoint - requires authentication' })
  @ApiResponse({
    status: 200,
    description: 'Successfully accessed protected resource',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'This is a protected endpoint',
        },
        user: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            name: { type: 'string' },
          },
          required: ['email', 'name'],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProtected(
    @Request()
    req: ExpressRequest & { user: UserResponse },
  ) {
    return {
      message: 'This is a protected endpoint',
      user: req.user,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy (HTTP 200 indicates health)',
  })
  getHealth() {
    return {};
  }
}
