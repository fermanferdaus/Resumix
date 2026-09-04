import { Skeleton } from "../ui/skeleton.jsx";

export const ProfileSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {/* Left Card: Avatar & Account Badge Skeleton */}
      <div className="md:col-span-1 bg-white border border-[#e2e8f0] p-6 flex flex-col items-center text-center rounded-none">
        {/* Avatar Frame Skeleton */}
        <div className="w-32 h-32 bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center rounded-none">
          <Skeleton className="w-16 h-16 rounded-none bg-[#e2e8f0]" />
        </div>

        {/* Name & Email Headline Skeleton */}
        <Skeleton className="h-5 w-40 mt-4 bg-[#f1f5f9] rounded-none" />
        <Skeleton className="h-3.5 w-48 mt-2 bg-[#f8fafc] rounded-none" />

        {/* Status Badge Skeleton */}
        <div className="mt-3 inline-flex items-center px-3 py-1 bg-[#f0fdf4] border border-[#bbf7d0] rounded-none">
          <Skeleton className="h-3.5 w-24 bg-[#dcfce7] rounded-none" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="w-full mt-6 pt-4 border-t border-[#e2e8f0] space-y-2">
          <Skeleton className="h-9 w-full bg-[#f1f5f9] rounded-none" />
        </div>
      </div>

      {/* Right Card: Personal Information Details Skeleton */}
      <div className="md:col-span-2 bg-white border border-[#e2e8f0] p-6 sm:p-8 flex flex-col justify-between rounded-none">
        <div>
          {/* Card Title Skeleton */}
          <div className="border-b border-[#e2e8f0] pb-3 mb-6">
            <Skeleton className="h-5 w-44 bg-[#f1f5f9] rounded-none" />
          </div>

          {/* Grid Information Fields Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Field 1: Nama Lengkap */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 bg-[#f8fafc] rounded-none" />
              <Skeleton className="h-5 w-44 bg-[#f1f5f9] rounded-none" />
            </div>

            {/* Field 2: Email */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 bg-[#f8fafc] rounded-none" />
              <Skeleton className="h-5 w-52 bg-[#f1f5f9] rounded-none" />
            </div>

            {/* Field 3: Phone */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 bg-[#f8fafc] rounded-none" />
              <Skeleton className="h-5 w-36 bg-[#f1f5f9] rounded-none" />
            </div>

            {/* Field 4: Tanggal Lahir */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 bg-[#f8fafc] rounded-none" />
              <Skeleton className="h-5 w-32 bg-[#f1f5f9] rounded-none" />
            </div>

            {/* Field 5: Domisili */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 bg-[#f8fafc] rounded-none" />
              <Skeleton className="h-5 w-48 bg-[#f1f5f9] rounded-none" />
            </div>

            {/* Field 6: Bergabung Sejak */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 bg-[#f8fafc] rounded-none" />
              <Skeleton className="h-5 w-36 bg-[#f1f5f9] rounded-none" />
            </div>
          </div>
        </div>

        {/* Security / Tips Banner Skeleton */}
        <div className="mt-8 p-4 bg-[#fbf8ff] border border-[#e2e8f0] flex items-center justify-between rounded-none">
          <div className="space-y-1.5 w-3/4">
            <Skeleton className="h-3.5 w-48 bg-[#f1f5f9] rounded-none" />
            <Skeleton className="h-3 w-64 bg-[#f8fafc] rounded-none" />
          </div>
          <Skeleton className="h-7 w-20 bg-[#f1f5f9] rounded-none" />
        </div>
      </div>
    </div>
  );
};