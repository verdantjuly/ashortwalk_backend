import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FeedEntity } from '../entities/feed.entity';
import { GroupRepository } from 'src/group/repositories';

@Injectable()
export class FeedRepository extends Repository<FeedEntity> {
  constructor(
    @InjectRepository(FeedEntity)
    private readonly repo: Repository<FeedEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly groupRepository: GroupRepository,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async createFeed(
    content: string,
    userId: string,
    nickname: string,
    groupId: string,
  ) {
    const Feed = new FeedEntity();
    Feed.content = content;
    Feed.userId = userId;
    Feed.groupId = groupId;
    Feed.nickname = nickname;
    const group = await this.groupRepository.findGroupById(groupId);
    Feed.group = group;
    return await this.save(Feed);
  }

  async findFeedById(FeedId: string) {
    const Feed = await this.findOneBy({ id: FeedId });
    if (!Feed) {
      throw new BadRequestException();
    }
    return Feed;
  }

  async updateFeed(content: string, feedId: string) {
    const Feed = await this.findOneBy({ id: feedId });
    if (!Feed) {
      throw new BadRequestException();
    }

    Feed.content = content;

    const updatedFeed = this.save(Feed);
    return updatedFeed;
  }

  async deleteFeed(feedId: string) {
    const Feed = await this.softRemove({ id: feedId });

    if (!Feed) {
      throw new BadRequestException();
    }
    return true;
  }

  async findFeeds(page: number, groupId: string) {
    const limit = 3;
    const Feeds = await this.find({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
      where: { groupId },
    });
    return Feeds;
  }
  async countFeeds(groupId: string) {
    return await this.count({ where: { groupId } });
  }
}
