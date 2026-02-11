import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global validation pipe like in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    await app.init();
  }, 30000); // Increase timeout for database connection

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('should return text/plain content type', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/plain/);
    });
  });

  describe('GET /protected', () => {
    it('should return 401 Unauthorized without token', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .expect(401);
    });

    it('should return 401 Unauthorized with invalid token', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 Unauthorized with malformed authorization header', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });

    it('should return 401 Unauthorized without Authorization header', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .expect(401);
    });
  });
});
