import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './services';
import { CommentsRepository } from './repositories';
import { CommentsController } from './controllers';
import { AuthModule } from 'src/user/user.module';
import { PostsModule } from 'src/posts/post.module';
import { CommentEntity } from './entities';
import { RedisModule } from 'src/common/redis';
import { AdminCommentController } from './controllers/admin-comment.controller';

dotenv.config();

@Module({
  imports: [
    PostsModule,
    AuthModule,
    TypeOrmModule.forFeature([CommentEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CommentsController, AdminCommentController],
  providers: [CommentsService, CommentsRepository, RedisModule],
  exports: [CommentsRepository],
})
export class CommentModule {}
