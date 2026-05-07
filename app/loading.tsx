export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-(--brand-hover) border-t-transparent"></div>
      </div>
    </div>
  );
}