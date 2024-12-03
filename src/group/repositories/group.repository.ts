import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupEntity } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class GroupRepository extends Repository<GroupEntity> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly repo: Repository<GroupEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async createGroup(
    groupName: string,
    description: string,
    tag: string,
    leaderUserId: string,
    leaderNickname: string,
  ) {
    const group = new GroupEntity();
    group.leaderNickname = leaderNickname;
    group.leaderUserId = leaderUserId;
    group.groupName = groupName;
    group.description = description;
    group.tag = tag;
    const result = await this.save(group);
    return result;
  }

  async findGroupById(groupId: string) {
    const group = await this.findOneBy({ id: groupId });
    if (!group) {
      throw new BadRequestException();
    }
    return group;
  }

  async updateGroup(
    id: string,
    groupName: string,
    description: string,
    tag: string,
  ) {
    const group = await this.findOneBy({ id });
    if (!group) {
      throw new BadRequestException();
    }

    group.groupName = groupName;
    group.description = description;
    group.tag = tag;

    const updatedGroup = this.save(group);
    return updatedGroup;
  }

  async deleteGroup(id: string) {
    const group = await this.softRemove({ id });

    if (!group) {
      throw new BadRequestException();
    }
    return true;
  }

  async findGroups(page: number) {
    const limit = 3;
    const groups = await this.find({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return groups;
  }

  async countTotalGroups() {
    return await this.count();
  }

  async myGroups(userId: string) {
    return await this.createQueryBuilder('groups')
      .innerJoin('groups.member', 'members')
      .where('members.userId = :userId', { userId })
      .select([
        'groups.groupName',
        'groups.description',
        'groups.leaderNickname',
        'groups.leaderUserId',
        'groups.id',
      ])
      .getMany();
  }

  async deleteGroupByName(groupName: string) {
    const info = await this.findOneBy({ groupName });
    const id = info.id;
    const group = await this.softRemove({ id });

    if (!group) {
      throw new BadRequestException();
    }
    return true;
  }

  async updatePoint(groupId: string, count: number) {
    const group = await this.findOneBy({ id: groupId })

    group.point = group.point + count
    return await this.save(group)
  }
}
