import { DataSource } from 'typeorm';
import { accounts } from './orders.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1213A',
    database: 'account',
    entities: [accounts],
    synchronize: true,
});
