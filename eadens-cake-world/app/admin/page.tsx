import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import AdminDashboard from "../../components/admin/dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard | Eadens Cake World",
  description: "Manage orders, products, and settings",
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/login") // Redirect unauthorized users to the login page
  }

  return <AdminDashboard />
}



