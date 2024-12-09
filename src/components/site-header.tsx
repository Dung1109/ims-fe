import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="flex h-14 items-center justify-end border-b bg-background px-6 w-full">
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <div>hoaank</div>
          <div className="text-muted-foreground">HR Department</div>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/logout">Logout</Link>
        </Button>
      </div>
    </header>
  )
}

