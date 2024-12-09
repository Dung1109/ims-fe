"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User2, Briefcase, MessageSquare, FileText, Users } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Homepage", href: "/", icon: Home },
  { name: "Candidate", href: "/candidate", icon: User2 },
  { name: "Job", href: "/job", icon: Briefcase },
  { name: "Interview", href: "/interview", icon: MessageSquare },
  { name: "Offer", href: "/offer", icon: FileText },
  { name: "User", href: "/user", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="h-full">
      <SidebarHeader className="border-b bg-[#f0f0f0] px-2 py-2">
        <Link
          href="/"
          className="flex flex-col  items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">DEV IMS</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <nav className="grid gap-4 px-2 group-[[data-collapsible=icon]]/sidebar:px-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  "group-[[data-collapsible=icon]]/sidebar:justify-center group-[[data-collapsible=icon]]/sidebar:px-2"
                )}
              >
                <item.icon className="h-6" />
                <span
                  className={cn(
                    "text-center w-full group-[[data-collapsible=icon]]/sidebar:hidden",
                    isActive && "underline underline-offset-4 font-semibold"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

