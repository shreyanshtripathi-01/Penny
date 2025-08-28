export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
};
