export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
        <p className="text-neutral-400">Loading...</p>
      </div>
    </div>
  )
}