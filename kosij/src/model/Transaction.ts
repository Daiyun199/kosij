export interface Transaction {
  id: number;
  transactionType: string;
  docId: number;
  amount: number;
  transactionStatus: string;
  createdTime: string;
}
