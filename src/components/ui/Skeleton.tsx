import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%]",
        className
      )}
      style={{
        animationDuration: "2s",
      }}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-32 w-full rounded-[2rem]", className)} />;
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-3/4 rounded-lg", className)} />;
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-12 w-12 rounded-full", className)} />;
}

export function SkeletonBar({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-8 w-full rounded-xl", className)} />;
}
