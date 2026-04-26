'use client'

import { useState } from 'react'
import { format, getDay, startOfMonth, addMonths, subMonths } from 'date-fns'
import { getMonthPhases } from '@/lib/cycle'
import { HW_PHASES } from '@/lib/hw-phases'
import HWCard from '@/components/ui/HWCard'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
}

const PHASE_HW_COLORS: Record<string, string> = {
  menstrual: '#f43f5e',
  follicular: '#a855f7',
  ovulatory: '#f0abfc',
  luteal: '#fb923c',
}

export default function CalendarClient({ profile }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = getDay(startOfMonth(currentDate))
  const monthName = format(currentDate, 'MMMM yyyy')

  const dayPhases = getMonthPhases(profile.last_period_date, profile.cycle_length, year, month)

  function getDayColor(day: number): string | null {
    const entry = dayPhases.find(
      (d) =>
        d.date.getFullYear() === year &&
        d.date.getMonth() + 1 === month &&
        d.date.getDate() === day
    )
    if (!entry) return null
    return PHASE_HW_COLORS[entry.phase] ?? null
  }

  const todayIsThisMonth =
    new Date().getFullYear() === year && new Date().getMonth() + 1 === month
  const todayDay = new Date().getDate()

  // Upcoming cycle events
  const nextPeriodDays = profile.cycle_length - (
    Math.floor(
      (new Date().getTime() - new Date(profile.last_period_date).getTime()) /
        (1000 * 60 * 60 * 24)
    ) % profile.cycle_length
  )
  const nextPeriodDate = new Date(Date.now() + nextPeriodDays * 86400000)
  const nextOvulationDate = new Date(Date.now() + Math.max(0, nextPeriodDays - 14) * 86400000)

  const phaseEntries = Object.values(HW_PHASES)

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2
          style={{
            color: 'white',
            fontSize: 26,
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            margin: 0,
          }}
        >
          {monthName}
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {['‹', '›'].map((ch, i) => (
            <button
              key={ch}
              onClick={() =>
                setCurrentDate((d) => (i === 0 ? subMonths(d, 1) : addMonths(d, 1)))
              }
              style={{
                width: 34,
                height: 34,
                borderRadius: 99,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <HWCard style={{ padding: 16, marginBottom: 16 }}>
        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                color: '#6b5a8a',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 0',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array(firstDayOfWeek)
            .fill(null)
            .map((_, i) => (
              <div key={`e-${i}`} />
            ))}
          {Array(daysInMonth)
            .fill(null)
            .map((_, i) => {
              const d = i + 1
              const color = getDayColor(d)
              const today = todayIsThisMonth && d === todayDay

              return (
                <div
                  key={d}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    background: today
                      ? 'linear-gradient(135deg, #7c3aed, #db2777)'
                      : color
                      ? `${color}20`
                      : 'transparent',
                    border: today
                      ? 'none'
                      : color
                      ? `1px solid ${color}40`
                      : '1px solid transparent',
                  }}
                >
                  <span
                    style={{
                      color: today ? 'white' : color ? color : '#c4b5d8',
                      fontSize: 13,
                      fontWeight: today ? 700 : 400,
                    }}
                  >
                    {d}
                  </span>
                  {color && !today && (
                    <div
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: 99,
                        background: color,
                        marginTop: 2,
                      }}
                    />
                  )}
                </div>
              )
            })}
        </div>
      </HWCard>

      {/* Phase legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {phaseEntries.map((ph) => (
          <div key={ph.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: ph.color }} />
            <span style={{ color: '#9b8db0', fontSize: 12 }}>{ph.name}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            }}
          />
          <span style={{ color: '#9b8db0', fontSize: 12 }}>Today</span>
        </div>
      </div>

      {/* Upcoming events */}
      <p
        style={{
          color: '#9b8db0',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          margin: '0 0 12px',
        }}
      >
        Upcoming
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {[
          {
            label: 'Ovulation window',
            date: format(nextOvulationDate, 'MMM d'),
            color: '#f0abfc',
          },
          { label: 'Next period', date: format(nextPeriodDate, 'MMM d'), color: '#f43f5e' },
          {
            label: 'Luteal phase starts',
            date: format(new Date(nextOvulationDate.getTime() + 2 * 86400000), 'MMM d'),
            color: '#fb923c',
          },
        ].map((ev) => (
          <HWCard
            key={ev.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  background: ev.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: 'white', fontSize: 14 }}>{ev.label}</span>
            </div>
            <span style={{ color: ev.color, fontSize: 13 }}>{ev.date}</span>
          </HWCard>
        ))}
      </div>
    </div>
  )
}
