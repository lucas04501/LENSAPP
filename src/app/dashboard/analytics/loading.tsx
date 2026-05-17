import { SkeletonCard, SkeletonBar } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBar className="w-48 h-8" />
        <SkeletonBar className="w-64 h-4" />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
      </div>

      <SkeletonCard className="h-[300px]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonCard className="h-[250px]" />
        <SkeletonCard className="h-[250px]" />
      </div>
    </div>
  );
}
