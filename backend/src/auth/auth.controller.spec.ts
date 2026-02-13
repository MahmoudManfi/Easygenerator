import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants';
import { UserResponse } from './types/auth.types';

describe('AuthController', () => {
  let controller: AuthController;
  let mockResponse: Partial<Response>;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123!',
    };

    it('should register a new user and set cookie', async () => {
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      mockAuthService.signUp.mockResolvedValue({
        access_token: mockToken,
        user: mockUser,
      });

      await controller.signUp(signUpDto, mockResponse as Response);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false, // NODE_ENV not set to production
          sameSite: 'lax', // 'lax' in development, 'strict' in production
          path: '/',
          maxAge: 24 * 60 * 60 * 1000,
        }),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });

    it('should handle signUp errors', async () => {
      const error = new Error('Database error');
      mockAuthService.signUp.mockRejectedValue(error);

      await expect(
        controller.signUp(signUpDto, mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should sign in user and set cookie', async () => {
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      mockAuthService.signIn.mockResolvedValue({
        access_token: mockToken,
        user: mockUser,
      });

      await controller.signIn(signInDto, mockResponse as Response);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax', // 'lax' in development, 'strict' in production
          path: '/',
          maxAge: 24 * 60 * 60 * 1000,
        }),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });

    it('should handle signIn errors', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.signIn.mockRejectedValue(error);

      await expect(
        controller.signIn(signInDto, mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });

  describe('logout', () => {
    it('should clear authentication cookie', () => {
      controller.logout(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax', // 'lax' in development, 'strict' in production
          path: '/',
        }),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User successfully signed out',
      });
    });
  });

  describe('checkAuth', () => {
    it('should return user object when authenticated', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockRequest = {
        user: mockUser,
      } as ExpressRequest & { user: UserResponse };

      const result = controller.checkAuth(mockRequest);
      expect(result).toEqual({ user: mockUser });
    });
  });
});
