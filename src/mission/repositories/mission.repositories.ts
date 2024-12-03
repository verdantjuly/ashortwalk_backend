import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MissionEntity } from '../entities/mission.entity';

@Injectable()
export class MissionRepository extends Repository<MissionEntity> {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly repo: Repository<MissionEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async createMission(
    title: string,
    content: string,
    userId: string,
    groupId: string,
  ) {
    const Mission = new MissionEntity();
    Mission.content = content;
    Mission.leaderId = userId;
    Mission.groupId = groupId;
    Mission.title = title;
    return await this.save(Mission);
  }
  async findMissionById(missionId: string) {
    const Mission = await this.findOneBy({ id: missionId });
    if (!Mission) {
      throw new BadRequestException();
    }
    return Mission;
  }



}


