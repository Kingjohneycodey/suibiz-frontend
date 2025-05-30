// types/sidebar.ts
import { ReactNode } from 'react'

export interface SidebarItem {
    href: string
    icon: ReactNode
    label: string
    exact?: boolean
}

export interface SidebarConfig {
    navItems: SidebarItem[]
    logo?: ReactNode
}