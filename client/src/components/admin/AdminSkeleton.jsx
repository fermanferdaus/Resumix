import { Skeleton } from "../ui/skeleton.jsx";
import { Card, CardContent, CardHeader } from "../ui/card.jsx";

export const AdminSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4 sm:my-6">
        {[1, 2, 3, 4].map((n) => (
          <Card key={n} className="p-3 sm:p-5 rounded-none">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 sm:w-24 bg-[#f1f5f9]" />
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 bg-[#f8fafc] border border-[#e2e8f0]" />
            </div>
            <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
              <Skeleton className="h-6 sm:h-8 w-14 sm:w-20 bg-[#f1f5f9]" />
              <Skeleton className="h-3 w-6 sm:w-8 bg-[#f8fafc]" />
            </div>
            <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 bg-[#f8fafc] mt-2 sm:mt-2.5" />
          </Card>
        ))}
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2 mb-6 overflow-x-auto">
        <Skeleton className="h-8 sm:h-9 w-24 sm:w-32 bg-[#f1f5f9] border border-[#e2e8f0] shrink-0" />
        <Skeleton className="h-8 sm:h-9 w-24 sm:w-28 bg-[#f8fafc] border border-[#e2e8f0] shrink-0" />
        <Skeleton className="h-8 sm:h-9 w-20 sm:w-24 bg-[#f8fafc] border border-[#e2e8f0] shrink-0" />
        <Skeleton className="h-8 sm:h-9 w-28 sm:w-32 bg-[#f8fafc] border border-[#e2e8f0] shrink-0" />
        <Skeleton className="h-8 sm:h-9 w-28 sm:w-32 bg-[#f8fafc] border border-[#e2e8f0] shrink-0" />
      </div>

      {/* Overview Chart Skeleton */}
      <Card>
        <CardHeader className="p-6 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-5 w-52 bg-[#f1f5f9] mb-1.5" />
              <Skeleton className="h-3 w-80 bg-[#f8fafc]" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-3 w-20 bg-[#f8fafc]" />
              <Skeleton className="h-3 w-20 bg-[#f8fafc]" />
              <Skeleton className="h-3 w-20 bg-[#f8fafc]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-[#e2e8f0]">
            {[40, 65, 30, 85, 45, 55, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center h-48">
                  <div style={{ height: `${h}%` }} className="w-3 sm:w-4 bg-[#f1f5f9]" />
                  <div style={{ height: `${Math.max(h - 20, 15)}%` }} className="w-3 sm:w-4 bg-[#f8fafc]" />
                  <div style={{ height: `${Math.max(h - 35, 10)}%` }} className="w-3 sm:w-4 bg-[#e2e8f0]" />
                </div>
                <Skeleton className="h-3 w-10 bg-[#f8fafc]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid 2 Column Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-44 bg-[#f1f5f9]" />
          <Skeleton className="h-3 w-64 bg-[#f8fafc]" />
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between mb-1.5">
                <Skeleton className="h-3 w-20 bg-[#f8fafc]" />
                <Skeleton className="h-3 w-12 bg-[#f8fafc]" />
              </div>
              <Skeleton className="h-2 w-full bg-[#f1f5f9]" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <Skeleton className="h-3 w-24 bg-[#f8fafc]" />
                <Skeleton className="h-3 w-12 bg-[#f8fafc]" />
              </div>
              <Skeleton className="h-2 w-full bg-[#f1f5f9]" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <Skeleton className="h-3 w-16 bg-[#f8fafc]" />
                <Skeleton className="h-3 w-12 bg-[#f8fafc]" />
              </div>
              <Skeleton className="h-2 w-full bg-[#f1f5f9]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-48 bg-[#f1f5f9]" />
          <Skeleton className="h-3 w-64 bg-[#f8fafc]" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-11 w-full bg-[#f8fafc] border border-[#e2e8f0]" />
            <Skeleton className="h-11 w-full bg-[#f8fafc] border border-[#e2e8f0]" />
            <Skeleton className="h-11 w-full bg-[#f8fafc] border border-[#e2e8f0]" />
          </div>
        </Card>
      </div>
    </div>
  );
};

