export const DashboardSkeleton = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-pulse">
      {/* Left / Main Content Skeleton */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Welcome Banner Skeleton */}
        <div className="bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-none">
          <div className="h-4 w-28 bg-[#fef2f2] border border-[#fecaca] mb-3 rounded-none" />
          <div className="h-8 w-3/4 max-w-md bg-[#f1f5f9] mb-3 rounded-none" />
          <div className="h-4 w-1/2 max-w-sm bg-[#f8fafc] rounded-none" />
        </div>

        {/* Section Header & Search Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-36 bg-[#f1f5f9] rounded-none" />
            <div className="h-5 w-14 bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
          </div>
          <div className="h-9 w-full sm:w-64 bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-[#e2e8f0] p-5 flex flex-col justify-between min-h-[220px] rounded-none"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="h-5 w-28 bg-[#fef2f2] border border-[#fecaca] rounded-none" />
                  <div className="h-4 w-4 bg-[#f1f5f9] rounded-none" />
                </div>
                <div className="h-5 w-4/5 bg-[#f1f5f9] mb-2 rounded-none" />
                <div className="h-3 w-1/2 bg-[#f8fafc] rounded-none" />
              </div>
              <div className="flex gap-2 pt-3 border-t border-[#f1f5f9]">
                <div className="h-8 flex-1 bg-[#f1f5f9] rounded-none" />
                <div className="h-8 w-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        {/* 1. Profile Strength Widget Skeleton */}
        <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-[#f1f5f9] rounded-none" />
            <div className="h-4 w-10 bg-[#fef2f2] rounded-none" />
          </div>
          <div className="h-2 w-full bg-[#f1f5f9] rounded-none" />
          <div className="h-3 w-full bg-[#f8fafc] rounded-none" />
          <div className="flex flex-col gap-2 pt-3 border-t border-[#f1f5f9]">
            <div className="h-3.5 w-3/4 bg-[#f8fafc] rounded-none" />
            <div className="h-3.5 w-4/5 bg-[#f8fafc] rounded-none" />
            <div className="h-3.5 w-2/3 bg-[#f8fafc] rounded-none" />
          </div>
        </div>

        {/* 2. Recent Activity Widget Skeleton */}
        <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
          <div className="h-4 w-28 bg-[#f1f5f9] pb-2 border-b border-[#e2e8f0] rounded-none" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#fef2f2] rounded-none" />
              <div className="flex-1">
                <div className="h-3 w-3/4 bg-[#f1f5f9] mb-1 rounded-none" />
                <div className="h-2.5 w-1/3 bg-[#f8fafc] rounded-none" />
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#f0fdf4] rounded-none" />
              <div className="flex-1">
                <div className="h-3 w-3/4 bg-[#f1f5f9] mb-1 rounded-none" />
                <div className="h-2.5 w-1/3 bg-[#f8fafc] rounded-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Pro Tip Card Skeleton */}
        <div className="bg-[#fef2f2] border border-[#fecaca] p-5 flex flex-col gap-2 rounded-none">
          <div className="h-4 w-24 bg-[#fecaca] rounded-none" />
          <div className="h-3.5 w-full bg-[#fee2e2] rounded-none" />
          <div className="h-3.5 w-4/5 bg-[#fee2e2] rounded-none" />
        </div>
      </aside>
    </div>
  );
};
