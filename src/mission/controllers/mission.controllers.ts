import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  Get,
  Patch,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { MissionService } from '../services/mission.services';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from 'src/user/types/user.type';

@Controller('api/groups/:groupId/missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post()
  @UseGuards(AuthGuard())
  async createMission(
    @Param() param,
    @Body() body: { title: string; content: string },
    @Req() req: { user: TokenPayload },
  ) {
    const { title, content } = body;
    const userId = req.user.id;
    const { groupId } = param;

    return await this.missionService.createMission(
      title,
      content,
      userId,
      groupId,
    );
  }

  @Get()
  getMission(@Param() param: { groupId: string }) {
    const { groupId } = param;
    return this.missionService.findMission(groupId);
  }

  @Patch(':missionId')
  @UseGuards(AuthGuard())
  async updateMission(
    @Req() req: { user: TokenPayload },
    @Param() param: { missionId: string; groupId: string },
    @Body() body: { title: string; content: string },
  ) {
    const { missionId, groupId } = param;
    const { title, content } = body;
    const userId = req.user.id;
    if (!missionId) {
      throw new BadRequestException();
    }
    return await this.missionService.updateMission(
      title,
      content,
      missionId,
      userId,
      groupId,
    );
  }

  @Delete()
  @UseGuards(AuthGuard())
  async deleteMission(@Req() req, @Param() param: { groupId: string }) {
    const { groupId } = param;
    const userId = req.user.id;
    const role = req.user.role;
    return await this.missionService.deleteMission(userId, role, groupId);
  }
}
