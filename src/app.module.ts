import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { PostsModule } from './posts/post.module';
import { RedisModule } from './common/redis';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './user/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
  imports: [
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
    }),

    AuthModule,
    PostsModule,
  ],
  controllers: [],
  providers: [JwtStrategy, RedisModule],
})
export class AppModule {}