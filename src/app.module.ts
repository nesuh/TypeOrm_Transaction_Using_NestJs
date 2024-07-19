import { Module } from '@nestjs/common';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import {TypeOrmModule} from '@nestjs/typeorm';
// import  from 'typeorm';
import {accounts} from './orders/orders.entity';
@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1213A',
      database: 'account',
      entities: [accounts],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([accounts]),
  ],
  controllers: [OrdersController],
  providers:[OrdersService],
 
})
export class AppModule{}
