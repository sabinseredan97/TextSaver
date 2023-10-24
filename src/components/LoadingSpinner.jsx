import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSpinner() {
  return (
    <div className="w-full flex items-center space-x-4">
      <div className="w-full space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-11/12" />
        <Skeleton className="h-5 w-10/12" />
      </div>
    </div>
  );
}
