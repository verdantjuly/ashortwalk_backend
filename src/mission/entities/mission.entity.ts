import { BaseEntity } from 'src/common/entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CompleteEntity } from './complete.entity';

@Entity('Mission')
export class MissionEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  leaderId: string;

  @Column({ type: 'varchar' })
  groupId: string;

  @OneToMany(() => CompleteEntity, complete => complete.mission, {
    cascade: true,
  })
  complete: CompleteEntity[];
}
