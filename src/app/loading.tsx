export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Skeleton Breadcrumbs / Navigation Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4 dark:border-zinc-800/50">
        {/* Home Button Placeholder */}
        <div className="h-9 w-20 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
        {/* Next/Prev Pagination Placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
          <div className="h-5 w-12 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
          <div className="h-9 w-9 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
        </div>
      </div>

      {/* Skeleton Surah Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 md:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 flex-1">
            {/* Metadata Badges Placeholders */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              <div className="h-5 w-20 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
            </div>
            {/* Names Placeholders */}
            <div className="space-y-2">
              <div className="h-8 w-44 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              <div className="h-4 w-28 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
            </div>
          </div>
          {/* Arabic Name Placeholder */}
          <div className="h-12 w-36 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer self-start md:self-auto" />
        </div>
      </div>

      {/* Center Bismillah Skeleton */}
      <div className="flex justify-center py-10">
        <div className="h-8 w-72 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
      </div>

      {/* Verses Skeleton List */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col p-6 rounded-2xl border border-zinc-200/60 bg-white dark:bg-zinc-900/20 dark:border-zinc-800/80 space-y-5"
          >
            {/* Meta & Actions Skeleton Bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              {/* Ayah Identifier Pill */}
              <div className="h-7 w-12 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              {/* Actions Controls */}
              <div className="flex gap-1">
                <div className="h-8 w-8 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
                <div className="h-8 w-8 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
                <div className="h-8 w-8 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              </div>
            </div>

            {/* Arabic Script Placeholder (Right Aligned) */}
            <div className="flex flex-col items-end space-y-2">
              <div className="h-9 w-[85%] rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              <div className="h-9 w-[45%] rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
            </div>

            {/* English Translation Placeholder (Left Aligned) */}
            <div className="space-y-2 border-l-2 border-zinc-100 pl-4 dark:border-zinc-850">
              <div className="h-3 w-12 rounded-xs bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              <div className="h-4 w-[90%] rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
            </div>

            {/* Bangla Translation Placeholder (Left Aligned) */}
            <div className="space-y-2 border-l-2 border-zinc-100 pl-4 dark:border-zinc-850">
              <div className="h-3 w-10 rounded-xs bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
              <div className="h-4 w-[75%] rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
