import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    )
}