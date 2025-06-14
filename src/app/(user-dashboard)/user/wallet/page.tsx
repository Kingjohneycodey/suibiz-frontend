import UserWallet from "@/components/dashboard/user/UserWallet";
import { Transaction } from "../../../../../types/wallet";


export default function UserDashboardWallet() {
    const vendorData: Transaction[] = [
        { 
            id: 1, 
            invoiceId: 'INV-2025-001', 
            name: 'Service Payment', 
            type: 'deposit', 
            amount: 1000, 
            currency: 'SUI', 
            date: '2025-06-12', 
            status: 'completed' 
        },
        { 
            id: 2, 
            invoiceId: 'INV-2025-002', 
            name: 'Withdrawal Request', 
            type: 'withdrawal', 
            amount: 250, 
            currency: 'USDC', 
            date: '2025-05-10', 
            status: 'completed' 
        },
        { 
            id: 3, 
            invoiceId: 'INV-2025-003', 
            name: 'Escrow Deposit', 
            type: 'escrow', 
            amount: 500, 
            currency: 'SUI', 
            date: '2025-05-05', 
            status: 'pending' 
        },
        { 
            id: 4, 
            invoiceId: 'INV-2025-004', 
            name: 'Freelance Work', 
            type: 'deposit', 
            amount: 750, 
            currency: 'USDC', 
            date: '2025-05-20', 
            status: 'completed' 
        },
        { 
            id: 5, 
            invoiceId: 'INV-2025-005', 
            name: 'Platform Fee', 
            type: 'withdrawal', 
            amount: 50, 
            currency: 'SUI', 
            date: '2025-05-18', 
            status: 'completed' 
        },
    ];
    return (
        <div className="space-y-6">
            <UserWallet 
                transactions={vendorData} 
            />
        </div>
    );
}