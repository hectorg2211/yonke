export function InventoryGridSkeleton() {
  return (
    <div className="mt-4" aria-hidden>
      <div className="h-11 border border-line bg-panel" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-11 w-20 shrink-0 border border-line bg-asphalt" />
          ))}
        </div>
        <div className="h-11 w-40 shrink-0 border border-line bg-asphalt" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="border border-line bg-panel">
            <div className="aspect-4/3 bg-asphalt" />
            <div className="grid gap-2 p-4">
              <div className="h-3 w-16 bg-line" />
              <div className="h-8 w-3/4 bg-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
