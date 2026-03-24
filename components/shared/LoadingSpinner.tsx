export default function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return <Spinner />
}

function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#E94560]/30 border-t-[#E94560] rounded-full animate-spin" />
    </div>
  )
}
