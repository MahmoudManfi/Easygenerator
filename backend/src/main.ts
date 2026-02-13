import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import cookieParser from 'cookie-parser';
import type { TransformableInfo } from 'logform';
import { AppModule } from './app.module';
import { getFrontendUrl, getPort } from './utils/env.util';
import { AUTH_COOKIE_NAME } from './constants/auth.constants';

/**
 * Main bootstrap function - initializes and starts the NestJS application
 */
async function bootstrap() {
  const logger = createLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  configureMiddleware(app);
  configureSwagger(app);

  const port = getPortNumber();
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(
    `Swagger documentation: http://localhost:${port}/api`,
    'Bootstrap',
  );
}

/**
 * Creates and configures the Winston logger
 * @returns Configured Winston logger instance
 */
function createLogger() {
  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf((info: TransformableInfo) => {
            const timestamp =
              typeof info.timestamp === 'string' ? info.timestamp : '';
            const level = typeof info.level === 'string' ? info.level : '';
            const message =
              typeof info.message === 'string' ? info.message : '';
            const context =
              typeof info.context === 'string' ? info.context : '';
            const trace = typeof info.trace === 'string' ? info.trace : '';
            return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
          }),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
}

/**
 * Configures middleware for the NestJS application
 * @param app - NestJS application instance
 */
function configureMiddleware(app: INestApplication) {
  // Enable cookie parser
  app.use(cookieParser());

  // Enable CORS for frontend
  const frontendUrl = getFrontendUrl();
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

/**
 * Configures Swagger API documentation
 * @param app - NestJS application instance
 */
function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('EasyGenerator API')
    .setDescription(
      'Authentication API for EasyGenerator application. Uses httpOnly cookies for authentication.',
    )
    .setVersion('1.0')
    .addCookieAuth(AUTH_COOKIE_NAME, {
      type: 'http',
      in: 'cookie',
      scheme: 'bearer',
      description:
        'JWT token stored in httpOnly cookie. Set automatically on signup/signin.',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

/**
 * Gets and validates the port from environment variables
 * @returns Valid port number
 * @throws Error if PORT is missing or invalid
 */
function getPortNumber(): number {
  const portString = getPort();
  const port = Number.parseInt(portString, 10);
  if (Number.isNaN(port)) {
    throw new Error(`Invalid PORT value: ${portString}. Must be a number.`);
  }
  return port;
}

void bootstrap();
