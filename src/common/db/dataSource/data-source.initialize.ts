import { DataSource, DataSourceOptions } from 'typeorm';
import { configNoEntities } from './data-source.config';

const AppDataSource = new DataSource(configNoEntities as DataSourceOptions);

AppDataSource.initialize();

export default AppDataSource;
