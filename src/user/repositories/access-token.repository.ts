import { Injectable } from '@nestjs/common';
import { RedisModule } from 'src/common/redis';

@Injectable()
export class AccessTokenRepository {
  constructor(private readonly redisModule: RedisModule) {}

  async saveAccessToken(
    userId: string,
    token: string,
    expiresIn: number,
  ): Promise<{ accessToken: string }> {
    await this.redisModule.setValue(
      `accessToken_${userId}`,
      `${token}`,
      expiresIn,
    );
    return { accessToken: token };
  }
}
