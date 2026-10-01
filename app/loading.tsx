export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Yükleniyor">
      <span className="block h-px w-24 bg-line overflow-hidden relative">
        <span className="absolute inset-y-0 left-0 w-1/3 bg-gold animate-[loadingBar_1.2s_ease-in-out_infinite]" />
      </span>
    </div>
  );
}
