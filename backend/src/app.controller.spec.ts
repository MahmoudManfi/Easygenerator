import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { Request as ExpressRequest } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
    });

    it('should call AppService.getHello()', () => {
      const getHelloSpy = jest.spyOn(appService, 'getHello');
      appController.getHello();
      expect(getHelloSpy).toHaveBeenCalled();
    });
  });

  describe('getProtected', () => {
    it('should return protected message and user data', () => {
      const mockUser = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
      };

      const mockRequest = {
        user: mockUser,
      } as ExpressRequest & { user: { userId: string; email: string } };

      const result = appController.getProtected(mockRequest);

      expect(result).toEqual({
        message: 'This is a protected endpoint',
        user: mockUser,
      });
    });

    it('should return protected message even if user is undefined', () => {
      const mockRequest = {
        user: undefined,
      } as ExpressRequest & { user?: { userId: string; email: string } };

      const result = appController.getProtected(mockRequest);

      expect(result).toEqual({
        message: 'This is a protected endpoint',
        user: undefined,
      });
    });

    it('should include user userId and email in response', () => {
      const mockUser = {
        userId: '507f1f77bcf86cd799439011',
        email: 'user@test.com',
      };

      const mockRequest = {
        user: mockUser,
      } as ExpressRequest & { user: { userId: string; email: string } };

      const result = appController.getProtected(mockRequest);

      expect(result.user).toBeDefined();
      expect(result.user?.userId).toBe(mockUser.userId);
      expect(result.user?.email).toBe(mockUser.email);
    });
  });
});
