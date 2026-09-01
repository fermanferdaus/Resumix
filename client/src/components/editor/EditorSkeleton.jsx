import { Navbar } from "../layout/Navbar.jsx";

export const EditorSkeleton = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f1f5f9] flex flex-col text-[#1a1b22] print:hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col pt-16 overflow-hidden">
        {/* Subheader Skeleton */}
        <div className="w-full bg-white border-b border-[#e2e8f0] px-4 sm:px-6 py-2 flex items-center justify-between gap-3 h-12 flex-shrink-0 animate-pulse">
          <div className="flex items-center gap-2.5 flex-1 max-w-sm">
            <div className="w-7 h-7 bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
            <div className="h-5 w-48 bg-[#f1f5f9] rounded-none" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-6 w-28 bg-[#fef2f2] border border-[#fecaca] rounded-none hidden sm:block" />
            <div className="h-7 w-24 bg-[#f1f5f9] rounded-none hidden md:block" />
            <div className="h-8 w-28 bg-[#ba1a1a]/20 rounded-none" />
          </div>
        </div>

        {/* Main 3-Column Workspace */}
        <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden animate-pulse">
          {/* 1. Left Sidebar Skeleton */}
          <aside className="w-full lg:w-60 bg-white border-r border-[#e2e8f0] p-3 sm:p-4 flex-shrink-0 flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div
                key={item}
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0]/60 flex items-center px-3 gap-2.5 rounded-none"
              >
                <div className="w-4 h-4 bg-[#e2e8f0] rounded-none" />
                <div className="h-3 w-28 bg-[#e2e8f0] rounded-none" />
              </div>
            ))}
          </aside>

          {/* 2. Center Column: Form Editor Skeleton */}
          <div className="w-full lg:w-96 xl:w-[480px] bg-white border-r border-[#e2e8f0] p-4 sm:p-6 overflow-y-auto h-full flex-shrink-0 space-y-4">
            <div className="border-b border-[#e2e8f0] pb-4 flex justify-between items-center">
              <div className="h-6 w-36 bg-[#f1f5f9] rounded-none" />
              <div className="h-4 w-4 bg-[#f1f5f9] rounded-none" />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="h-3 w-20 bg-[#f1f5f9] mb-1.5 rounded-none" />
                  <div className="h-9 w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
                </div>
                <div>
                  <div className="h-3 w-16 bg-[#f1f5f9] mb-1.5 rounded-none" />
                  <div className="h-9 w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="h-3 w-24 bg-[#f1f5f9] mb-1.5 rounded-none" />
                  <div className="h-9 w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
                </div>
                <div>
                  <div className="h-3 w-20 bg-[#f1f5f9] mb-1.5 rounded-none" />
                  <div className="h-9 w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
                </div>
              </div>

              <div>
                <div className="h-3 w-28 bg-[#f1f5f9] mb-1.5 rounded-none" />
                <div className="h-9 w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
              </div>

              <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
                <div className="h-3 w-40 bg-[#f1f5f9] rounded-none" />
                <div className="h-9 w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-none" />
              </div>
            </div>
          </div>

          {/* 3. Right Column: Live A4 Preview Skeleton */}
          <div className="flex-1 bg-[#525659]/10 p-4 sm:p-8 overflow-y-auto h-full flex justify-center items-start">
            <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-md border border-[#e2e8f0] p-12 sm:p-16 space-y-6 rounded-none">
              {/* Header Resume */}
              <div className="space-y-2 pb-4 border-b border-[#e2e8f0]">
                <div className="h-7 w-56 bg-[#f1f5f9] rounded-none" />
                <div className="h-4 w-40 bg-[#f8fafc] rounded-none" />
                <div className="h-3 w-72 bg-[#f8fafc] rounded-none" />
              </div>

              {/* Summary Section */}
              <div className="space-y-2">
                <div className="h-4 w-28 bg-[#f1f5f9] border-b border-[#1a1b22]/20 pb-1 rounded-none" />
                <div className="h-3 w-full bg-[#f8fafc] rounded-none" />
                <div className="h-3 w-11/12 bg-[#f8fafc] rounded-none" />
                <div className="h-3 w-4/5 bg-[#f8fafc] rounded-none" />
              </div>

              {/* Experience Section */}
              <div className="space-y-3">
                <div className="h-4 w-36 bg-[#f1f5f9] border-b border-[#1a1b22]/20 pb-1 rounded-none" />
                <div className="flex justify-between">
                  <div className="h-3.5 w-44 bg-[#f1f5f9] rounded-none" />
                  <div className="h-3 w-24 bg-[#f8fafc] rounded-none" />
                </div>
                <div className="h-3 w-32 bg-[#f8fafc] rounded-none" />
                <div className="space-y-1.5 pl-4">
                  <div className="h-2.5 w-full bg-[#f8fafc] rounded-none" />
                  <div className="h-2.5 w-5/6 bg-[#f8fafc] rounded-none" />
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-3">
                <div className="h-4 w-32 bg-[#f1f5f9] border-b border-[#1a1b22]/20 pb-1 rounded-none" />
                <div className="flex justify-between">
                  <div className="h-3.5 w-48 bg-[#f1f5f9] rounded-none" />
                  <div className="h-3 w-20 bg-[#f8fafc] rounded-none" />
                </div>
                <div className="h-3 w-36 bg-[#f8fafc] rounded-none" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
