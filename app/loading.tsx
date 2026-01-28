export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 mx-auto mb-12 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
