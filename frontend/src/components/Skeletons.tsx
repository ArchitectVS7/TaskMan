import clsx from 'clsx';

function Shimmer({ className }: { className?: string }) {
  return <div className={clsx('bg-gray-200 dark:bg-gray-700 rounded animate-pulse', className)} />;
}

export function DashboardSkeleton() {
  return (
    <div>
      <Shimmer className="h-8 w-48 mb-6" />

      {/* Insights placeholder */}
      <Shimmer className="h-24 w-full mb-8 rounded-lg" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-7 w-12" />
              </div>
              <Shimmer className="h-10 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Shimmer className="h-6 w-32" />
            <Shimmer className="h-4 w-16" />
          </div>
          <div className="grid gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Shimmer className="h-5 w-2/3" />
                  <Shimmer className="h-5 w-14 rounded" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Shimmer className="h-4 w-20 rounded" />
                  <Shimmer className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Shimmer className="h-6 w-36" />
            <Shimmer className="h-4 w-16" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Shimmer className="w-3 h-3 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Shimmer className="h-4 w-3/4" />
                  <Shimmer className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex gap-4">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-4 w-16" />
        <Shimmer className="h-4 w-16" />
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-4 w-16 ml-auto" />
      </div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <Shimmer className="h-4 w-1/2" />
            <Shimmer className="h-3 w-1/3" />
          </div>
          <Shimmer className="h-6 w-20 rounded" />
          <Shimmer className="h-5 w-14 rounded" />
          <Shimmer className="h-4 w-24" />
          <div className="flex items-center gap-1.5">
            <Shimmer className="w-5 h-5 rounded-full" />
            <Shimmer className="h-3 w-16" />
          </div>
          <Shimmer className="h-3 w-20" />
          <div className="flex gap-1">
            <Shimmer className="h-5 w-5 rounded" />
            <Shimmer className="h-5 w-5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[...Array(4)].map((_, col) => (
        <div key={col} className="flex-1 min-w-[260px] p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3">
            <Shimmer className="h-6 w-20 rounded" />
            <Shimmer className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, card) => (
              <div key={card} className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <Shimmer className="h-4 w-3/4 mb-2" />
                <Shimmer className="h-3 w-full mb-2" />
                <div className="flex items-center gap-2">
                  <Shimmer className="h-4 w-12 rounded" />
                  <Shimmer className="h-3 w-16" />
                  <Shimmer className="w-5 h-5 rounded-full ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Shimmer className="h-2 w-full" />
          <div className="p-4">
            <Shimmer className="h-5 w-2/3 mb-2" />
            <Shimmer className="h-3 w-full mb-1" />
            <Shimmer className="h-3 w-3/4 mb-3" />
            <div className="flex items-center gap-4">
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
