// app/dashboard/vendor/layout.tsx
import { LayoutDashboard, Package, BarChart2, ShoppingBag } from 'lucide-react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'
import { SidebarConfig } from '../../../types/sidebar'


export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
    const sidebarConfig: SidebarConfig = {
        logo: 'Vendor Portal',
        navItems: [
        {
            href: '/vendor',
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: 'Dashboard',
        },
        {
            href: '/vendor/products',
            icon: <Package className="w-5 h-5" />,
            label: 'Products',
        },
        {
            href: '/vendor/orders',
            icon: <ShoppingBag className="w-5 h-5" />,
            label: 'Orders',
        },
        {
            href: '/vendor/analytics',
            icon: <BarChart2 className="w-5 h-5" />,
            label: 'Analytics',
        },
        ]
    }

    return (
        <DashboardLayoutClient sidebarConfig={sidebarConfig}>
        {children}
        </DashboardLayoutClient>
    )
}