import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IBaseEntity } from './interfaces/baseEntity.interface';

export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', generated: 'uuid' })
  @Index({ unique: true })
  uuid: string;
}
