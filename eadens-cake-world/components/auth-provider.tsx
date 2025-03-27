"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string | null
  email: string
  role: "CUSTOMER" | "ADMIN"
  address?: string | null
  phone?: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "CUSTOMER" | "ADMIN") => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false) // Track mount state
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        
        if (!res.ok) throw new Error("Auth check failed")
        
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear invalid token if exists
        if (typeof window !== 'undefined') {
          document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Only run auth check on client side
    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleAuthResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Request failed")
    }
    return response.json()
  }

  const login = async (email: string, password: string) => {
    if (!mounted) return
    
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await handleAuthResponse(res)
      setUser(data.user)
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name || data.user.email}!`,
      })

      // Redirect based on role
      router.push(data.user.role === "ADMIN" ? "/admin" : "/account")
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Authentication error",
        variant: "destructive",
      })
      throw error // Re-throw for form handling
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: "CUSTOMER" | "ADMIN") => {
    if (!mounted) return
    
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await handleAuthResponse(res)
      setUser(data.user)
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.user.name || data.user.email}!`,
      })

      // Redirect based on role
      router.push(data.user.role === "ADMIN" ? "/admin" : "/account")
      router.refresh()
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Registration error",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      
      toast({
        title: "Logout Successful",
        description: "You have been logged out",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout",
        variant: "destructive",
      })
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !mounted) return
    
    setIsLoading(true)
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await handleAuthResponse(res)
      setUser({ ...user, ...responseData.user })
      
      toast({
        title: "Profile Updated",
        description: "Your changes were saved",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update profile",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}