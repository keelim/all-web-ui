import { Skeleton as AstryxSkeleton } from "@astryxdesign/core/Skeleton"
import { cn } from "../lib/cn"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AstryxSkeleton
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...(props as Omit<React.ComponentProps<typeof AstryxSkeleton>, "className">)}
    />
  )
}

export { Skeleton }
