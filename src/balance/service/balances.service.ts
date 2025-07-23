import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from '../entities/balance.entity';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Balance)
    private readonly balancesRepository: Repository<Balance>,
  ) {}

  // Get User Balance for specific currency

  async getUserBalance(userId: number, currency: string): Promise<Balance | null> {
    return this.balancesRepository.findOne({
      where: {
        user_id: userId,
        currency_symbol: currency,
      },
    });
  }

  // Add balance to a user's balance

  async addBalance(userId: number, currency: string, amount: number): Promise<Balance> {
    const existingBalance = await this.getUserBalance(userId, currency);

    if (existingBalance) {
      existingBalance.balance += amount;
      await this.balancesRepository.save(existingBalance);
      console.log(`Balance updated for user ${userId}: +${amount} ${currency}`);
      return existingBalance;
    }

    const newBalance = this.balancesRepository.create({
      user_id: userId,
      currency_symbol: currency,
      balance: amount,
    });

    await this.balancesRepository.save(newBalance);
    console.log(`New balance record created for user ${userId}: ${amount} ${currency}`);

    return newBalance;
  }

  // Deduct balance from a user's balance

  async deductBalance(userId: number, currency: string, amount: number): Promise<Balance> {
    const balance = await this.getUserBalance(userId, currency);

    if (!balance || balance.balance < amount) {
      throw new Error(`Insufficient balance for user ${userId}: ${currency}`);
    }

    balance.balance -= amount;
    await this.balancesRepository.save(balance);
    console.log(`Balance deducted for user ${userId}: -${amount} ${currency}`);

    return balance;
  }

  // Get all balance in the balances table

  async getAllBalances(): Promise<Balance[]> {
    return this.balancesRepository.find();
  }
}

