import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CompleteService } from '../services/complete.services';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from 'src/user/types/user.type';

@Controller('api/groups/:groupId/completes')
export class CompleteController {
  constructor(private readonly compeleteService: CompleteService) {}

  @Post()
  @UseGuards(AuthGuard())
  async createCompelte(
    @Param() param: { groupId: string },
    @Req() req: { user: TokenPayload },
  ) {
    const { groupId } = param;
    const userId = req.user.id;
    return await this.compeleteService.createCompelete(userId, groupId);
  }
  @Get()
  @UseGuards(AuthGuard())
  async countCompletes(@Param() param: { groupId: string }) {
    const { groupId } = param;
    return await this.compeleteService.countCompletes(groupId);
  }

  @Get('/check')
  @UseGuards(AuthGuard())
  async isComplete(@Param() param: { groupId: string }, @Req() req) {
    const { groupId } = param;
    const userId = req.user.id;
    return await this.compeleteService.isComplete(groupId, userId);
  }
}
