import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('The amount requested is greater than the total account');
    }

    let findCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    if (!findCategory) {
      const newCategory = categoryRepository.create({
        title: category
      });

      findCategory = await categoryRepository.save(newCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: findCategory.id
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
