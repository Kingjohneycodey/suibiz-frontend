import { LayoutDashboard, Users, Package, Settings } from 'lucide-react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'
import { SidebarConfig } from '../../../types/sidebar'


export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const sidebarConfig: SidebarConfig = {
        logo: 'Admin Panel',
        navItems: [
            {
                href: '/admin',
                icon: <LayoutDashboard className="w-5 h-5" />,
                label: 'Dashboard',
            },
            {
                href: '/admin/users',
                icon: <Users className="w-5 h-5" />,
                label: 'Users',
            },
            {
                href: '/admin/products',
                icon: <Package className="w-5 h-5" />,
                label: 'Products',
            },
            {
                href: '/admin/settings',
                icon: <Settings className="w-5 h-5" />,
                label: 'Settings',
            },
        ]
    }
    
    return (
        <DashboardLayoutClient sidebarConfig={sidebarConfig}>
            {children}
        </DashboardLayoutClient>
    )
}