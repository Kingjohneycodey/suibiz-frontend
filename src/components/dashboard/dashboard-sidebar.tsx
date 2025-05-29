'use client'
import Link from 'next/link'
import { 
    LayoutDashboard, 
    Users,
    Package,
    Settings,
    ChevronLeft, 
    ChevronRight,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar({
    isCollapsed,
    isMobile,
    toggleSidebar,
}: {
    isCollapsed: boolean
    isMobile: boolean
    toggleSidebar: () => void
}) {
    const pathname = usePathname()

    const navItems = [
        {
            href: '/dashboard/admin',
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: 'Dashboard',
            active: pathname === '/dashboard/admin',
        },
        {
            href: '/dashboard/admin/customers',
            icon: <Users className="w-5 h-5" />,
            label: 'Customers',
            active: pathname.startsWith('/dashboard/admin/customers'),
        },
        {
            href: '/dashboard/admin/products',
            icon: <Package className="w-5 h-5" />,
            label: 'Products',
            active: pathname.startsWith('/dashboard/admin/products'),
        },
        {
            href: '/dashboard/admin/settings',
            icon: <Settings className="w-5 h-5" />,
            label: 'Settings',
            active: pathname.startsWith('/dashboard/admin/settings'),
        },
    ]

    return (
        <aside 
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isMobile ? 'fixed inset-y-0 z-50' : 'relative'}
                ${isMobile && isCollapsed ? 'hidden' : ''}
            `}
        >
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8">
                    {!isCollapsed && (
                        <div className="text-xl font-bold text-gray-800 dark:text-white">
                            Logo
                        </div>
                    )}
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:block"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                        ) : (
                            <ChevronLeft className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                        )}
                    </button>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-3">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                        item.active
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {item.icon}
                                    {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    )
}