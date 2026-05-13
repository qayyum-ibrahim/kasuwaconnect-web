type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-light-gray rounded-card ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-card border border-border p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}