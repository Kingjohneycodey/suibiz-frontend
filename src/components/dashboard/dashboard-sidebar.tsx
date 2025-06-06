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
    const { navItems } = config
    const isActive = (href: string) => {
        return pathname === href;
    }

    return (
        <>
            {isMobile && !isCollapsed && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside 
                className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out h-full
                    ${isCollapsed ? 'w-20' : 'w-64'} 
                    ${isMobile ? 'fixed inset-y-0 z-50' : 'relative'}
                    ${isMobile && isCollapsed ? '-translate-x-full' : ''}
                `}
            >
                <div className="flex flex-col h-full p-4">
                    {isMobile && !isCollapsed && (
                        <button
                            onClick={toggleSidebar}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {!isMobile && (
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="w-6 h-6" />
                                ) : (
                                    <ChevronLeft className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    )}

                    <nav className="flex-1 mt-10">
                        <ul className="space-y-2">
                            {navItems.map((item) => (                    
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center p-3 rounded-lg transition-colors ${
                                            isActive(item.href)
                                            ? 'bg-blue-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <span className="flex items-center justify-center w-6 h-6">
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}