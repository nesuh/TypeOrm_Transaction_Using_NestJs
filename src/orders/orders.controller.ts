import { Controller, Param, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AccountDto } from './transfer-funds.dto';
import { OrdersService } from './orders.service';
import { pipeline } from 'stream';

@Controller('api')
export class OrdersController {
  constructor(private readonly transactionService: OrdersService) {}
//hi bro if transfer money from one account to other account use these 
  @Post('transfer')
  async transferFunds(@Body() accountDto: AccountDto) {
    try {
      const result = await this.transactionService.transferFunds(accountDto);
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
//hi bro if you create account use these 
  @Post('create')
  async createAccount(@Body() accountDto: AccountDto) {
    try {
      const result = await this.transactionService.createAccount(accountDto);
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
//used to deposit money on your account 
  @Post('deposit/:accountNumber')
  async deposit(@Param('accountNumber') accountNumber: number, @Body() body: { amount: number }) {
    try {
      const result = await this.transactionService.deposit(accountNumber, body.amount);
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
//Used To Withdraw amount from account number that you given  
  @Post('withdraw/:accountNumber')
  async withdraw(@Param('accountNumber') accountNumber: number, @Body() body: { amount: number }) {
    try {
      const result = await this.transactionService.withdraw(accountNumber, body.amount);
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //used to using id all detail information about the customer
  @Get(':id')
  async getAccount(@Param('id') id: number) {
    try {
      const account = await this.transactionService.getAccount(id);
      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, data: account };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
