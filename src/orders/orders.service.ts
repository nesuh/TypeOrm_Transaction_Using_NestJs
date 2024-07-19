import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { accounts } from './orders.entity';
import { AccountDto } from './transfer-funds.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(accounts)
    private readonly accountRepository: Repository<accounts>,
  ) {}

  async createAccount(accountDto: AccountDto) {
    const { accountNumber, amount } = accountDto;
    const newAccount = this.accountRepository.create({ accountNumber, balance: amount });
    return await this.accountRepository.save(newAccount);
  }

  async deposit(accountNumber: number, amount: number) {
    const account = await this.accountRepository.findOne({ where: { accountNumber } });

    if (!account) {
      throw new Error('Account not found');
    }

    account.balance += amount;
    return await this.accountRepository.save(account);
  }

  async withdraw(accountNumber: number, amount: number) {
    const account = await this.accountRepository.findOne({ where: { accountNumber } });

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.balance < amount) {
      throw new Error('Insufficient funds');
    }

    account.balance -= amount;
    return await this.accountRepository.save(account);
  }

  async transferFunds(accountDto: AccountDto) {
    const { fromAccountNumber, toAccountNumber, amount } = accountDto;
    const queryRunner = this.accountRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromAccount = await queryRunner.manager.findOne(accounts, {
        where: { accountNumber: fromAccountNumber },
        lock: { mode: 'pessimistic_write' },
      });
      const toAccount = await queryRunner.manager.findOne(accounts, {
        where: { accountNumber: toAccountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) {
        throw new Error('Account not found');
      }

      if (fromAccount.balance < amount) {
        throw new Error('Insufficient balance');
      }

      fromAccount.balance -= amount;
      toAccount.balance += amount;

      await queryRunner.manager.save(fromAccount);
      await queryRunner.manager.save(toAccount);

      await queryRunner.commitTransaction();

      return { message: 'Fund transfer successful' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAccount(id: number) {
    return await this.accountRepository.findOne({ where: { id } });
  }
}
