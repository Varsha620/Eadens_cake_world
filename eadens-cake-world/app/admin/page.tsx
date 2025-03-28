import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import AdminDashboard from "@/components/admin/dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/login")
  }

  return <AdminDashboard />
}