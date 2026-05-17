import { SkeletonCircle, SkeletonBar, SkeletonCard } from "@/components/ui/Skeleton";

export default function SocialLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <SkeletonBar className="w-48 h-8" />
        <SkeletonBar className="w-64 h-4" />
      </div>

      {/* Compose Skeleton */}
      <SkeletonCard className="h-40" />

      {/* Posts Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-[2rem] border border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-4">
            <SkeletonCircle />
            <div className="space-y-2 flex-1">
              <SkeletonBar className="w-32 h-4" />
              <SkeletonBar className="w-24 h-3" />
            </div>
          </div>
          <div className="space-y-3">
            <SkeletonBar className="w-full h-4" />
            <SkeletonBar className="w-full h-4" />
            <SkeletonBar className="w-2/3 h-4" />
          </div>
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <SkeletonBar className="w-20 h-8" />
            <SkeletonBar className="w-20 h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
