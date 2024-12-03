import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { MissionEntity } from './entities/mission.entity';
import { MissionController } from './controllers/mission.controllers';
import { MissionService } from './services/mission.services';
import { MissionRepository } from './repositories/mission.repositories';

dotenv.config();

@Module({
  imports: [
    GroupModule,
    TypeOrmModule.forFeature([MissionEntity]),
    AuthModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MissionController],
  providers: [MissionService, MissionRepository],
  exports: [],
})
export class MissionModule {}
