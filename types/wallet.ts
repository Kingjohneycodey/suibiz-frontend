export type Transaction = {
    id: number;
    invoiceId: string;
    name: string;
    type: 'deposit' | 'withdrawal' | 'escrow';
    amount: number;
    currency: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
};

export type UserWalletProps = {
    transactions: Transaction[];
};