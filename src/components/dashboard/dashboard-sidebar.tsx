'use client'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarConfig } from '../../../types/sidebar'

interface DashboardSidebarProps {
    config: SidebarConfig
    isCollapsed: boolean
    isMobile: boolean
    toggleSidebar: () => void
}

export default function DashboardSidebar({
    config,
    isCollapsed,
    isMobile,
    toggleSidebar,
}: DashboardSidebarProps) {
    const pathname = usePathname()
    const { navItems, logo } = config
    const isActive = (href: string) => {
        // Exact match for dashboard root
        // if (href === '/dashboard' && pathname === '/dashboard') return true
        // return pathname === href || 
        // (pathname.startsWith(`${href}/`) && href !== '/dashboard')

        return pathname === href;
        
    }

    return (
        <aside 
            className={`bg-white dark:bg-gray-800 border-r relative border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isMobile ? 'fixed inset-y-0 z-50' : 'relative'}
                ${isMobile && isCollapsed ? 'hidden' : ''}
            `}
        >
            {isMobile && !isCollapsed && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                    <X className="w-6 h-6" />
                </button>
            )}
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:block"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="text-gray-600 dark:text-gray-300 w-6 h-6" />
                        ) : (
                            <ChevronLeft className="text-gray-600 dark:text-gray-300 w-6 h-6 absolute right-0" />
                        )}
                    </button>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-3">
                        {navItems.map((item) => {                    
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                        isActive(item.href)
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {item.icon}
                                        {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    )
}