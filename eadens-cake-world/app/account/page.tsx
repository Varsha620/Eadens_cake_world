"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import AccountProfile from "@/components/account/profile"
import AccountOrders from "@/components/account/orders"

export default function AccountPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container py-8 md:py-16">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8 md:py-16">
      <h1 className="mb-8 text-3xl font-bold text-primary md:text-4xl">My Account</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <AccountProfile user={user} />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <AccountOrders />
        </TabsContent>
      </Tabs>
    </div>
  )
}

