export function Bone({
  className,
}: {
  className?: string;
}) {
  return <div className={`skeleton ${className ?? ""}`} />;
}

export function InventoryGridSkeleton() {
  return (
    <div className="mt-5" role="status" aria-live="polite">
      <span className="sr-only">Cargando inventario</span>
      <div className="relative" aria-hidden>
        <Bone className="h-11 border border-line" />
        <div className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 rounded-full bg-line/40" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 md:hidden" aria-hidden>
        <Bone className="h-11 border border-line" />
        <Bone className="h-11 border border-line" />
      </div>
      <div
        className="mt-4 hidden items-center justify-between gap-4 md:flex"
        aria-hidden
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <Bone className="h-11 w-16 shrink-0 border border-line" />
          <Bone className="h-11 w-20 shrink-0 border border-line" />
          <Bone className="h-11 w-20 shrink-0 border border-line" />
          <Bone className="h-11 w-24 shrink-0 border border-line" />
          <Bone className="h-11 w-24 shrink-0 border border-line" />
          <Bone className="h-11 w-16 shrink-0 border border-line" />
        </div>
        <Bone className="h-11 w-40 shrink-0 border border-line" />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-line bg-panel">
      <div className="relative aspect-4/3 overflow-hidden">
        <Bone className="absolute inset-0" />
        <Bone className="absolute top-3 left-3 h-6 w-24 border border-line" />
      </div>
      <div className="grid gap-3 p-4">
        <Bone className="h-3 w-16" />
        <Bone className="h-8 w-3/4" />
        <div className="mt-1 flex items-end justify-between gap-3 pt-1">
          <Bone className="h-5 w-16" />
          <Bone className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Cargando pieza</span>
      <div className="flex items-center gap-2" aria-hidden>
        <Bone className="h-3 w-24" />
        <span className="text-line">/</span>
        <Bone className="h-3 w-36" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12" aria-hidden>
        <div className="relative min-h-105 overflow-hidden border border-line bg-panel lg:col-span-7">
          <Bone className="absolute inset-0" />
          <Bone className="absolute top-4 left-4 h-7 w-32 border border-line" />
        </div>

        <div className="flex flex-col lg:col-span-5">
          <Bone className="h-3 w-44" />
          <Bone className="mt-4 h-14 w-11/12 md:h-16" />
          <Bone className="mt-2 h-14 w-2/3 md:h-16" />
          <Bone className="mt-5 h-7 w-24" />
          <div className="mt-5 grid gap-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-5/6" />
            <Bone className="h-4 w-4/6" />
          </div>

          <div className="mt-8 grid gap-px bg-line">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[7.5rem_1fr] gap-4 bg-oil py-3 md:grid-cols-[8.5rem_1fr]"
              >
                <Bone className="h-3 w-16" />
                <Bone className="h-4 w-40 max-w-full" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Bone className="h-12 w-28 border border-line" />
            <Bone className="h-12 w-48 border border-line" />
          </div>
          <Bone className="mt-4 h-4 w-72 max-w-full" />
        </div>
      </div>

      <section className="mt-20 border-t border-line pt-12" aria-hidden>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Bone className="h-3 w-28" />
            <Bone className="mt-3 h-10 w-52" />
          </div>
          <Bone className="h-3 w-28" />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
