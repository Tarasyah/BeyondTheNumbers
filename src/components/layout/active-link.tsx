"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

type ActiveLinkProps = ComponentProps<typeof Link>

export function ActiveLink({ href, className, children, ...props }: ActiveLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href.toString()

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground/80",
        isActive ? "text-foreground" : "text-foreground/60",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
