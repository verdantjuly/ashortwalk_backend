import { BaseEntity } from 'src/common/entity';
import { GroupEntity } from 'src/group/entities';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('Feeds')
export class FeedEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'varchar' })
  groupId: string;

  @ManyToOne(() => GroupEntity, group => group.feed, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  group: GroupEntity;
}
