import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AuditEntity } from '../../customBaseEntites/AuditEntity';

export interface IBaseCustomRepository<T extends AuditEntity> {
  findOne(options: FindOneOptions<T>): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
}
