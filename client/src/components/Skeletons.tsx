// Grey placeholders shaped like the real content, shown while it loads.
const block = "rounded-sm bg-brume animate-pulse motion-reduce:animate-none";

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-sm border border-ardoise bg-brume-profond"
    >
      <div className={`aspect-square ${block} rounded-none`} />
      <div className="space-y-3 p-5">
        <div className={`h-3 w-24 ${block}`} />
        <div className={`h-5 w-2/3 ${block}`} />
        <div className={`h-4 w-full ${block}`} />
        <div className={`h-4 w-20 ${block}`} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Chargement de la collection"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement du flacon"
      className="mx-auto max-w-6xl px-6 pb-24 pt-10 lg:pt-14"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className={`mb-8 h-3 w-64 ${block}`} />
          <div className={`aspect-square w-full ${block}`} />
        </div>
        <div className="space-y-5">
          <div className={`h-3 w-32 ${block}`} />
          <div className={`h-12 w-3/4 ${block}`} />
          <div className={`h-6 w-1/2 ${block}`} />
          <div className={`h-20 w-full ${block}`} />
          <div className="grid grid-cols-3 gap-3 pt-5">
            <div className={`h-44 ${block}`} />
            <div className={`h-44 ${block}`} />
            <div className={`h-44 ${block}`} />
          </div>
          <div className={`h-12 w-60 rounded-full ${block}`} />
        </div>
      </div>
    </div>
  );
}
