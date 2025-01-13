import Link from "next/link"
import { ChevronRight } from 'lucide-react'

export function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/job-list" className="hover:text-foreground">
        Job List
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground">Create job</span>
    </div>
  )
}

