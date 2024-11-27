import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../services';
import { CreateGroupDto } from '../dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from 'src/user/types/user.type';
import { GroupEntity } from '../entities';
import { UpdateGroupDto } from '../dto';

@Controller('api/groups')
export class GrpupController {
  constructor(private readonly groupService: GroupService) { }

  @Get('count')
  async countTotalPages() {
    return await this.groupService.countTotalPages();
  }

  @Get('mygroups/:id')
  async myGroups(@Param() param: { id: string }) {
    const { id } = param;

    return await this.groupService.myGroups(id);
  }


  @Post()
  @UseGuards(AuthGuard())
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: { user: TokenPayload },
  ) {
    const leaderUserId = req.user.id;
    const nickname = req.user.nickname;
    const groupName = createGroupDto.groupName;
    const description = createGroupDto.description;
    const tag = createGroupDto.tag;

    return await this.groupService.createGroup(
      groupName,
      description,
      tag,
      leaderUserId,
    );
  }

  @Get(':groupId')
  getPost(@Param() param: { groupId: string }): Promise<GroupEntity> {
    const { groupId } = param;
    if (!groupId) {
      throw new BadRequestException();
    }
    return this.groupService.findGroup(groupId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateGroup(
    @Req() req: { user: TokenPayload },
    @Param() param: { id: string },
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const { id } = param;
    if (!id) {
      throw new BadRequestException();
    }
    return await this.groupService.updateGroup(
      id,
      updateGroupDto.groupName,
      updateGroupDto.description,
      updateGroupDto.tag,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteUser(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const role = req.user.role;
    return await this.groupService.deleteGroup(userId, role, id);
  }

  @Get()
  getGroups(@Query() query: { page: number }) {
    let { page } = query;
    if (!page) {
      page = 1;
    }
    return this.groupService.findGroups(page);
  }

  @Delete('/name/:groupName')
  async deleteGroupByName(@Req() req, @Param('groupName') groupName: string) {
    return await this.groupService.deleteGroupByName(groupName);
  }
}
