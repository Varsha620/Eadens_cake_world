import type { Metadata } from "next"
import AdminDashboard from "@/components/admin/dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Eadens Cake World",
  description: "Manage orders, products, and settings",
}

export default function AdminPage() {
  return <AdminDashboard />
}

