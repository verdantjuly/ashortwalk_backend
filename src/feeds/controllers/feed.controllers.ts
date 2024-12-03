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
import { FeedService } from '../services/feed.services';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from 'src/user/types/user.type';

@Controller('api/groups/:groupId/feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) { }

  @Post()
  @UseGuards(AuthGuard())
  async createGroup(
    @Param() param,
    @Body() body: { content: string },
    @Req() req: { user: TokenPayload },
  ) {
    const content = body.content;
    const userId = req.user.id;
    const nickname = req.user.nickname;
    const { groupId } = param;

    return await this.feedService.createFeed(
      content,
      userId,
      nickname,
      groupId,
    );
  }

  @Patch(':feedId')
  @UseGuards(AuthGuard())
  async updateGroup(
    @Req() req: { user: TokenPayload },
    @Param() param: { groupId: string; feedId: string },
    @Body() body: { content: string },
  ) {
    const { feedId } = param;
    const { content } = body;
    if (!feedId) {
      throw new BadRequestException();
    }
    return await this.feedService.updateFeed(content, feedId);
  }

  @Delete(':feedId')
  @UseGuards(AuthGuard())
  async deleteUser(@Req() req, @Param() param: { feedId: string }) {
    const { feedId } = param;
    const userId = req.user.id;
    const role = req.user.role;
    return await this.feedService.deleteFeed(userId, role, feedId);
  }

  @Get()
  getFeeds(
    @Query() query: { page: number },
    @Param() param: { groupId: string },
  ) {
    let { page } = query;
    const { groupId } = param;
    if (!page) {
      page = 1;
    }
    return this.feedService.findFeeds(page, groupId);
  }

  @Get('/count')
  countFeeds(@Param() param: { groupId: string }) {
    const { groupId } = param;
    return this.feedService.countFeeds(groupId);
  }
}
