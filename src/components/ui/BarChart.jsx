// Histogramme léger en pur CSS (pas de dépendance externe).
export default function BarChart({ data = [], labels = [], height = 180, color = 'bg-teal-700' }) {
  const max = Math.max(...data, 1)
  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10px] font-semibold text-ink-400 opacity-0 transition-opacity group-hover:opacity-100">
              {v}
            </span>
            <div
              className={`w-full rounded-t-md ${color} transition-all duration-300 hover:opacity-80`}
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      {labels.length > 0 && (
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center text-[10px] text-ink-400">{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}
