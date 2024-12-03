import { Column, Entity, OneToMany } from 'typeorm';
import { MemberEntity } from './member.entity';
import { BaseEntity } from 'src/common/entity';
import { FeedEntity } from 'src/feeds/entities/feed.entity';

@Entity('Groups')
export class GroupEntity extends BaseEntity {
  @Column({ type: 'integer', default: 0 })
  point: number;

  @Column({ type: 'varchar' })
  leaderUserId: string;

  @Column({ type: 'varchar' })
  leaderNickname: string;

  @Column({ type: 'varchar' })
  groupName: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  tag: string;

  @OneToMany(() => MemberEntity, member => member.group, { cascade: true })
  member: MemberEntity[];

  @OneToMany(() => FeedEntity, feed => feed.group, { cascade: true })
  feed: FeedEntity[];


}
