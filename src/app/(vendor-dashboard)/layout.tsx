import { LayoutDashboard, Package,
    Upload, HandPlatter, CloudUpload,
    BookUp, CalendarArrowUp
} from 'lucide-react'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';
import { SidebarConfig } from '../../../types/sidebar';


export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
    const sidebarConfig: SidebarConfig = {
        logo: 'Vendor Portal',
        navItems: [
            {
                href: '/business',
                icon: <LayoutDashboard className="w-5 h-5" />,
                label: 'Dashboard',
            },
            {
                href: '/business/products',
                icon: <Package className="w-5 h-5" />,
                label: 'Products',
            },
            {
                href: '/business/product-upload',
                icon: <Upload className="w-5 h-5"/>,
                label: 'Upload Product',
            },
            {
                href: "/business/services",
                icon: <HandPlatter className="w-5 h-5"/>,
                label: 'Services',
            },
            {
                href: '/business/service-upload',
                icon: <CloudUpload className="w-5 h-5"/>,
                label: 'Service Upload',
            },
            {
                href: '/business/bookings',
                icon: <BookUp className="w-5 h-5"/>,
                label: 'Bookings',
            },
            {
                href: '/business/orders',
                icon: <CalendarArrowUp className="w-5 h-5"/>,
                label: 'Orders',
            },
        ]
    }

    return (
        <DashboardLayoutClient sidebarConfig={sidebarConfig}>
            {children}
        </DashboardLayoutClient>
    )
}