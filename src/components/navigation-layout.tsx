"use client"

import * as React from "react"
import { Search, User, Bell, Plus, ChevronDown, Code2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface NavigationLayoutProps {
  className?: string
  children?: React.ReactNode
  user?: any
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({ className, children, user }) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const router = useRouter()
  const supabase = createClient()

  const navLinks = [
    { label: "Components", href: "/components" },
    { label: "Templates", href: "/templates" },
    { label: "Creators", href: "/creators" },
    { label: "Documentation", href: "/docs" },
    { label: "Pricing", href: "/pricing" }
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Compose Forge</span>
            </Link>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                  <Link href="/components/new" className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Plus className="h-5 w-5" />
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/my-components" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                        My Compose Components
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                        Profile
                      </Link>
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Sign in
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}