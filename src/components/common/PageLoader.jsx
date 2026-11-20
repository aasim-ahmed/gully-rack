export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="h-0.5 w-32 overflow-hidden bg-ink/10">
          <div className="h-full w-1/3 animate-[loader_1s_ease-in-out_infinite] bg-blue" />
        </div>
        <span className="eyebrow text-ink/50">Loading</span>
      </div>
      <style>{`@keyframes loader{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  )
}
