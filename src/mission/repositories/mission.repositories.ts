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
    const mission = new MissionEntity();
    mission.content = content;
    mission.leaderId = userId;
    mission.groupId = groupId;
    mission.title = title;
    return await this.save(mission);
  }

  async findMissionById(groupId: string) {
    const mission = await this.findOne({ where: { groupId } });

    return mission;
  }

  async updateMission(title: string, content: string, missionId: string) {
    const mission = await this.findOneBy({ id: missionId });
    if (!mission) {
      throw new BadRequestException();
    }

    mission.content = content;
    mission.title = title;
    const updateMission = await this.save(mission);
    return updateMission;
  }

  async deleteMission(missionId: string) {
    await this.softRemove({ id: missionId });

    return true;
  }
}
