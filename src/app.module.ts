import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { PostsModule } from './posts/post.module';
import { RedisModule } from './common/redis';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './user/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { KeyController } from './key/key.controller';
import { CommentModule } from './comments/comments.module';
import { GroupModule } from './group/group.module';
import { FeedModule } from './feeds/feed.module';
import { HealthController } from './health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModel, MessageSchema } from './chat/schemas/message.schema';
import { ChatModule } from './chat/chat.module';
import { ModuleRef } from '@nestjs/core';
import { MissionModule } from './mission/mission.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([
      { name: MessageModel.name, schema: MessageSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      entities: ['dist/**/**.entity.{js,ts}'],
      synchronize: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),

    AuthModule,
    PostsModule,
    CommentModule,
    GroupModule,
    FeedModule,
    ChatModule,
    MissionModule,
  ],
  controllers: [KeyController, HealthController],
  providers: [JwtStrategy, RedisModule],
})
export class AppModule {
  constructor(private readonly moduleRef: ModuleRef) {}
}
