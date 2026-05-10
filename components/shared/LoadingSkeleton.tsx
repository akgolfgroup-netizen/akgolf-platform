import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  /** Forhåndsdefinerte varianter */
  variant: "card" | "metric" | "chart" | "list-item" | "profile" | "timeline";
  /** Antall skeletons å vise */
  count?: number;
  className?: string;
}

const skeletonBase = "bg-[#EFEDE6]";

function CardSkeleton() {
  return (
    <div className={cn("rounded-[20px] border border-[#E5E3DD] bg-white p-5")} style={{ height: 160 }}>
      <Skeleton className={cn(skeletonBase, "mb-3 h-4 w-[40%]")} />
      <Skeleton className={cn(skeletonBase, "mb-2 h-3 w-[80%]")} />
      <Skeleton className={cn(skeletonBase, "h-3 w-[60%]")} />
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className={cn("rounded-[20px] border border-[#E5E3DD] bg-white p-5")} style={{ height: 100 }}>
      <Skeleton className={cn(skeletonBase, "mb-3 h-3 w-[30%]")} />
      <Skeleton className={cn(skeletonBase, "mb-2 h-7 w-[50%]")} />
      <Skeleton className={cn(skeletonBase, "h-3 w-[20%]")} />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className={cn("rounded-[20px] border border-[#E5E3DD] bg-white p-5")} style={{ height: 200 }}>
      <Skeleton className={cn(skeletonBase, "mb-4 h-4 w-[35%]")} />
      <Skeleton className={cn(skeletonBase, "h-[calc(100%-40px)] w-full rounded-lg")} />
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3" style={{ height: 60 }}>
      <Skeleton className={cn(skeletonBase, "h-10 w-10 shrink-0 rounded-full")} />
      <div className="flex-1">
        <Skeleton className={cn(skeletonBase, "mb-2 h-3 w-[60%]")} />
        <Skeleton className={cn(skeletonBase, "h-3 w-[40%]")} />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className={cn("rounded-[20px] border border-[#E5E3DD] bg-white p-6")} style={{ height: 300 }}>
      <div className="flex flex-col items-center">
        <Skeleton className={cn(skeletonBase, "mb-4 h-16 w-16 rounded-full")} />
        <Skeleton className={cn(skeletonBase, "mb-2 h-4 w-[50%]")} />
        <Skeleton className={cn(skeletonBase, "mb-2 h-3 w-[40%]")} />
        <Skeleton className={cn(skeletonBase, "mb-6 h-3 w-[30%]")} />
      </div>
      <div className="flex gap-3">
        <Skeleton className={cn(skeletonBase, "h-16 flex-1 rounded-xl")} />
        <Skeleton className={cn(skeletonBase, "h-16 flex-1 rounded-xl")} />
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <Skeleton className={cn(skeletonBase, "h-6 w-6 rounded-full")} />
            {i < 4 && <Skeleton className={cn(skeletonBase, "mt-1 h-8 w-0.5")} />}
          </div>
          <div className="flex-1 pt-0.5">
            <Skeleton className={cn(skeletonBase, "mb-2 h-3 w-[60%]")} />
            <Skeleton className={cn(skeletonBase, "h-3 w-[40%]")} />
          </div>
        </div>
      ))}
    </div>
  );
}

const variantMap: Record<LoadingSkeletonProps["variant"], () => React.JSX.Element> = {
  card: CardSkeleton,
  metric: MetricSkeleton,
  chart: ChartSkeleton,
  "list-item": ListItemSkeleton,
  profile: ProfileSkeleton,
  timeline: TimelineSkeleton,
};

export function LoadingSkeleton({ variant, count = 1, className }: LoadingSkeletonProps) {
  const Component = variantMap[variant];
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
