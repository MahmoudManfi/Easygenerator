import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppService } from './app.service';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
            userId: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProtected(
    @Request()
    req: ExpressRequest & { user?: { userId: string; email: string } },
  ) {
    return {
      message: 'This is a protected endpoint',
      user: req.user,
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
