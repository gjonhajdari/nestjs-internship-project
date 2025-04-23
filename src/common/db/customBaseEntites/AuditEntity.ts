import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { IAuditEntity } from './interfaces/auditEntity.interface';

export abstract class AuditEntity extends BaseEntity implements IAuditEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
