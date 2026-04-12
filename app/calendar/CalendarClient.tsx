'use client'

import { useState } from 'react'
import { format, getDay, startOfMonth, addMonths, subMonths, isSameDay, isToday } from 'date-fns'
import { getMonthPhases, PHASE_LABELS, PHASE_COLORS } from '@/lib/cycle'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
}

const PHASE_BG_LIGHT: Record<string, string> = {
  menstrual: 'bg-red-100 text-red-700 border-red-200',
  follicular: 'bg-purple-100 text-purple-700 border-purple-200',
  ovulatory: 'bg-orange-100 text-orange-700 border-orange-200',
  luteal: 'bg-indigo-100 text-indigo-700 border-indigo-200',
}

export default function CalendarClient({ profile }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const dayPhases = getMonthPhases(profile.last_period_date, profile.cycle_length, year, month)

  const firstDayOfWeek = getDay(startOfMonth(currentDate))

  const [selectedDay, setSelectedDay] = useState<typeof dayPhases[0] | null>(null)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Cycle Calendar</h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setCurrentDate((d) => subMonths(d, 1))}
          className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-all font-bold"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold text-gray-700">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-all font-bold"
        >
          ›
        </button>
      </div>

      {/* Calendar grid */}
      <div className="glass rounded-2xl p-4 shadow-sm">
        {/* Week headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for first week offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {dayPhases.map((dayPhase) => {
            const dayNum = dayPhase.date.getDate()
            const isTodayDate = isToday(dayPhase.date)
            const isSelected = selectedDay && isSameDay(selectedDay.date, dayPhase.date)

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(isSelected ? null : dayPhase)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative text-xs
                  ${isSelected
                    ? 'ring-2 ring-purple-400 ring-offset-1'
                    : 'hover:scale-105'
                  }
                  ${isTodayDate
                    ? 'ring-2 ring-purple-500 ring-offset-1'
                    : ''
                  }
                `}
              >
                <div
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center opacity-80 ${
                    PHASE_BG_LIGHT[dayPhase.phase]
                  }`}
                >
                  <span className={`font-semibold ${isTodayDate ? 'text-purple-700' : ''}`}>
                    {dayNum}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day info */}
      {selectedDay && (
        <div className={`mt-4 rounded-2xl p-4 shadow-sm border ${PHASE_BG_LIGHT[selectedDay.phase]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{format(selectedDay.date, 'EEEE, MMMM d')}</p>
              <p className="text-sm mt-0.5">{PHASE_LABELS[selectedDay.phase]} Phase · Day {selectedDay.dayOfCycle}</p>
            </div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: PHASE_COLORS[selectedDay.phase] }}
            />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-5 glass rounded-xl p-4 shadow-sm">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Phase Legend</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PHASE_LABELS).map(([phase, label]) => (
            <div key={phase} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: PHASE_COLORS[phase as keyof typeof PHASE_COLORS] }}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
