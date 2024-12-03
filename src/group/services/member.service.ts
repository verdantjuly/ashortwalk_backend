import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.reopsitory';
import { MemberEntity } from '../entities';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) { }

  createMember(
    groupId: string,
    userId: string,
    nickname: string,
  ): Promise<MemberEntity> {
    const result = this.memberRepository.createMember(
      groupId,
      userId,
      nickname,
    );
    return result;
  }
  async findMember(groupId: string, userId: string): Promise<MemberEntity> {
    const result = await this.memberRepository.findMember(groupId, userId);

    return result;
  }

  async findMembersCount(groupId: string): Promise<number> {
    const result = await this.memberRepository.countMembers(groupId);

    return result;
  }

  findMembers(groupId: string): Promise<MemberEntity[]> {
    const result = this.memberRepository.findMembers(groupId);
    return result;
  }
  deleteMember(groupId: string, userId: string): Promise<boolean> {
    const result = this.memberRepository.deleteMember(groupId, userId);
    return result;
  }
}
