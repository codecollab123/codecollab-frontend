// Nested layout example (app/dashboard/layout.tsx)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Never use <html> or <body> here
    <div className="dashboard">
      <nav>...</nav>
      {children}
    </div>
  )
}