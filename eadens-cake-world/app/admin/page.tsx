import type { Metadata } from "next"
import AdminDashboard from "@/components/admin/dashboard"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin Dashboard | Eadens Cake World",
  description: "Manage orders, products, and settings",
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== "ADMIN") {
    redirect("/login")
  }
  return <AdminDashboard />
}



