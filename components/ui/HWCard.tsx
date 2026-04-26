import { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  style?: CSSProperties
  className?: string
  onClick?: () => void
}

export default function HWCard({ children, style, className = '', onClick }: Props) {
  const base: CSSProperties = {
    background: 'linear-gradient(135deg, rgba(42,16,69,0.5) 0%, rgba(30,10,56,0.5) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '16px 18px',
    backdropFilter: 'blur(10px)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.15s, box-shadow 0.15s',
    ...style,
  }

  return (
    <div
      style={base}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.01)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'
        }
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {children}
    </div>
  )
}
