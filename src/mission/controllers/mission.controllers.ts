import { Body, Controller, Param, Post, Req, UseGuards, Get } from '@nestjs/common';
import { MissionService } from '../services/mission.services';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from 'src/user/types/user.type';

@Controller('api/groups/:groupId/missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) { }

  @Post()
  @UseGuards(AuthGuard())
  async feedGroup(
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


  @Get(":missionId")
  getMission(
    @Param() param: { missionId: string },
  ) {
    const { missionId } = param;
    return this.missionService.findMission(missionId);
  }




}
