type Props = {
  scanning: boolean
}

const CORNER_SIZE = 28
const BORDER = 3

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const h = position.startsWith('t') ? 'top-0' : 'bottom-0'
  const v = position.endsWith('l') ? 'left-0' : 'right-0'
  const borderT = position.startsWith('t') ? `border-t-[${BORDER}px]` : ''
  const borderB = position.startsWith('b') ? `border-b-[${BORDER}px]` : ''
  const borderL = position.endsWith('l') ? `border-l-[${BORDER}px]` : ''
  const borderR = position.endsWith('r') ? `border-r-[${BORDER}px]` : ''

  const style = {
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth:    position.startsWith('t') ? BORDER : 0,
    borderBottomWidth: position.startsWith('b') ? BORDER : 0,
    borderLeftWidth:   position.endsWith('l')   ? BORDER : 0,
    borderRightWidth:  position.endsWith('r')   ? BORDER : 0,
    borderColor: 'rgb(34 211 238)',
    boxShadow: '0 0 12px rgba(34,211,238,0.7), 0 0 4px rgba(34,211,238,1)',
    borderRadius:
      position === 'tl' ? '4px 0 0 0' :
      position === 'tr' ? '0 4px 0 0' :
      position === 'bl' ? '0 0 0 4px' : '0 0 4px 0',
  }

  return (
    <div className={`absolute ${h} ${v}`} style={style} />
  )
}

export function ScanFrame({ scanning }: Props) {
  return (
    <div
      className={`relative w-full h-full transition-opacity duration-500 ${scanning ? 'opacity-100' : 'opacity-70'}`}
    >
      {/* Fond de grille très subtil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 4 coins en L */}
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      {/* Halo pulsant sur le cadre entier quand scanning */}
      {scanning && (
        <div
          className="absolute inset-0 animate-pulse pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(34,211,238,0.08)',
            border: '1px solid rgba(34,211,238,0.15)',
          }}
        />
      )}
    </div>
  )
}
