import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;
    let total = 0;

    const transactions = await this.find();

    transactions.forEach(item => {
      switch (item.type) {
        case 'income':
          income = income + Number(item.value);
          break;
        case 'outcome':
          outcome += Number(item.value);
      }
    });

    total = income - outcome;

    const result = { income, outcome, total }

    return result;
  }
}

export default TransactionsRepository;
