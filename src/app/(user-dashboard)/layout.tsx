import { LayoutDashboard, User, CreditCard } from 'lucide-react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'
import { SidebarConfig } from '../../../types/sidebar'
import { ShoppingBag, NotebookPen } from 'lucide-react'


export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarConfig: SidebarConfig = {
    logo: 'My Account',
    navItems: [
      {
        href: '/user',
        icon: <LayoutDashboard className="w-5 h-5" />,
        label: 'Overview',
      },
      {
        href: '/user/profile',
        icon: <User className="w-5 h-5" />,
        label: 'Profile',
      },
      {
        href: '/user/wallet',
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Wallet',
      },
      {
        href: '/user/orders',
        icon: <ShoppingBag className="w-5 h-5" />,
        label: 'Orders',
      },
      {
        href: '/user/bookings',
        icon: <NotebookPen className="w-5 h-5" />,
        label: 'Bookings',
      }
    ]
  }
  
  return (
    <DashboardLayoutClient sidebarConfig={sidebarConfig}>
      {children}
    </DashboardLayoutClient>
  )
}