import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entities';
import { RedisModule } from 'src/common/redis';

@Injectable()
export class AccessTokenRepository {
  constructor(private readonly redisModule: RedisModule) {}

  async saveAccessToken(
    user: UserEntity,
    token: string,
    expiresIn: number,
  ): Promise<{ accessToken: string }> {
    await this.redisModule.setValue(
      `accessToken_${user.id}`,
      `${token}`,
      expiresIn,
    );
    return { accessToken: token };
  }
}
