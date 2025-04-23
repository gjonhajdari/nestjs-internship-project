import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { DataSourceOptions } from 'typeorm';
import { config } from '../dataSource/data-source.config';
import { UsersSeeder } from './users/create-users.seed';

seeder({
  imports: [TypeOrmModule.forRoot(config as DataSourceOptions)],
}).run([UsersSeeder]);
