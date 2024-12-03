import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CompleteEntity } from '../entities/complete.entity';
import { MissionRepository } from './mission.repositories';

@Injectable()
export class CompleteRepository extends Repository<CompleteEntity> {
  constructor(
    @InjectRepository(CompleteEntity)
    private readonly repo: Repository<CompleteEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly missionRepository: MissionRepository,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  async findComplete(userId: string, groupId: string) {
    return await this.findOne({ where: { userId, groupId } });
  }
  async createComplete(userId: string, groupId: string) {
    const mission = await this.missionRepository.findMissionById(groupId);
    const complete = new CompleteEntity();
    complete.userId = userId;
    complete.groupId = groupId;
    complete.missionId = mission.id;
    complete.mission = mission;
    return await this.save(complete);
  }

  async countCompletes(missionId: string) {
    return await this.count({ where: { missionId } });
  }
}
