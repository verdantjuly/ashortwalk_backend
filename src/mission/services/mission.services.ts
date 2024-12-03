import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MissionRepository } from '../repositories/mission.repositories';
import { GroupRepository } from 'src/group/repositories';
import { MemberRepository } from 'src/group/repositories/member.reopsitory';
import { CompleteRepository } from '../repositories/complete.repositories';

@Injectable()
export class MissionService {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly groupRepository: GroupRepository,
    private readonly memberRepository: MemberRepository,
    private readonly compeleteReopsitory: CompleteRepository,
  ) {}

  async createMission(
    title: string,
    content: string,
    userId: string,
    groupId: string,
  ) {
    const group = await this.groupRepository.findGroupById(groupId);
    const mission = await this.missionRepository.findMissionById(groupId);
    if (group.leaderUserId !== userId) {
      throw new UnauthorizedException();
    }
    if (mission) {
      throw new ConflictException();
    }

    const result = await this.missionRepository.createMission(
      title,
      content,
      userId,
      groupId,
    );
    return result;
  }

  async findMission(groupId: string) {
    const Mission = await this.missionRepository.findMissionById(groupId);
    return Mission;
  }

  async updateMission(
    title: string,
    content: string,
    missionId: string,
    userId: string,
    groupId: string,
  ) {
    const group = await this.groupRepository.findGroupById(groupId);
    if (group.leaderUserId !== userId) {
      throw new UnauthorizedException();
    }
    const compeleteCount =
      await this.compeleteReopsitory.countCompletes(missionId);
    if (compeleteCount !== 0) {
      throw new BadRequestException();
    }
    return await this.missionRepository.updateMission(
      title,
      content,
      missionId,
    );
  }

  async deleteMission(userId: string, role: string, groupId: string) {
    const mission = await this.missionRepository.findMissionById(groupId);
    const membersCount = await this.memberRepository.countMembers(groupId);
    const compeleteCount = await this.compeleteReopsitory.countCompletes(
      mission.id,
    );
    if (role !== 'admin') {
      if (userId !== mission.leaderId) {
        throw new BadRequestException();
      }
    }

    if (membersCount > compeleteCount) {
      console.log('here');
      throw new BadRequestException();
    }
    const count = await this.memberRepository.countMembers(groupId);
    await this.groupRepository.updatePoint(groupId, count);
    return await this.missionRepository.deleteMission(mission.id);
  }
}
