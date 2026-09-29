export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#f8f8f5] text-[#111215] relative overflow-hidden">
      {/* Top progress bar placeholder */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#eb4c2a]/30 animate-pulse z-50" />

      {/* Hero skeleton */}
      <div className="pt-28 pb-20 border-b border-[rgba(17,18,21,0.08)] bg-[#f7f6f0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-6 w-16 bg-[#eb4c2a]/15 rounded animate-pulse" />
                <div className="h-5 w-40 bg-[rgba(17,18,21,0.08)] rounded animate-pulse" />
              </div>
              <div className="h-12 w-3/4 bg-[rgba(17,18,21,0.12)] rounded animate-pulse" />
              <div className="h-20 w-full bg-[rgba(17,18,21,0.06)] rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-28 bg-[rgba(17,18,21,0.08)] rounded animate-pulse" />
                <div className="h-8 w-28 bg-[rgba(17,18,21,0.08)] rounded animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-72 w-full rounded-[6px] bg-[#111215]/10 animate-pulse border border-[rgba(17,18,21,0.1)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="h-48 w-full bg-white rounded-[2px] border border-[rgba(17,18,21,0.08)] animate-pulse" />
        <div className="h-72 w-full bg-white rounded-[2px] border border-[rgba(17,18,21,0.08)] animate-pulse" />
      </div>
    </div>
  );
}
