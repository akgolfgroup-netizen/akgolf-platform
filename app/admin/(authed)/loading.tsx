export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-[#D5DFDB] rounded" />
        <div className="h-4 w-32 bg-[#ECF0EF] rounded mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#D5DFDB] p-5"
          >
            <div className="h-3 w-20 bg-[#ECF0EF] rounded mb-3" />
            <div className="h-8 w-16 bg-[#D5DFDB] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#D5DFDB] p-5">
        <div className="h-4 w-32 bg-[#D5DFDB] rounded mb-4" />
        <div className="h-40 bg-[#ECF0EF] rounded-lg" />
      </div>
    </div>
  );
}
