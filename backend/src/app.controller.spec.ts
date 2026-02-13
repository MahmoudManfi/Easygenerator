import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import type { Request as ExpressRequest } from 'express';
import { UserResponse } from './auth/types/auth.types';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return empty object', () => {
      const result = appController.getHealth();
      expect(result).toEqual({});
    });
  });

  describe('getProtected', () => {
    it('should return protected message and user data', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockRequest = {
        user: mockUser,
      } as ExpressRequest & { user: UserResponse };

      const result = appController.getProtected(mockRequest);

      expect(result).toEqual({
        message: 'This is a protected endpoint',
        user: mockUser,
      });
    });
  });
});
