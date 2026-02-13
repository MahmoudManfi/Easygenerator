import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import {
  getMongoRootUsername,
  getMongoRootPassword,
  getMongoInitDbDatabase,
} from './utils/env.util';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${getMongoRootUsername()}:${getMongoRootPassword()}@mongodb:27017/${getMongoInitDbDatabase()}?authSource=admin`,
    ),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
