type Props = {
  total: number
  current: number
  onChange: (index: number) => void
}

export function ProgressIndicators({ total, current, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-label={`Écran ${i + 1}`}
          className="transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i === current
              ? 'rgb(34 211 238)'
              : 'rgba(255,255,255,0.2)',
            boxShadow: i === current
              ? '0 0 8px rgba(34,211,238,0.8)'
              : 'none',
          }}
        />
      ))}
    </div>
  )
}
