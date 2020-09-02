import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';


import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const findTransaction = await transactionRepository.findOne({ where: { id } });

    if (!findTransaction) {
      throw new AppError('Transaction not found!');
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
