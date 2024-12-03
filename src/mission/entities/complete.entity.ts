import { BaseEntity } from 'src/common/entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MissionEntity } from './mission.entity';

@Entity('Complete')
export class CompleteEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  groupId: string;

  @Column({ type: 'varchar' })
  missionId: string;

  @ManyToOne(() => MissionEntity, mission => mission.complete, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  mission: MissionEntity;
}
