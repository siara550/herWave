import { differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal'

export interface PhaseInfo {
  phase: CyclePhase
  dayOfCycle: number
  daysRemaining: number
  startDay: number
  endDay: number
}

export interface DayPhase {
  date: Date
  phase: CyclePhase
  dayOfCycle: number
}

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: '#f87171',   // red-400
  follicular: '#c084fc',  // purple-400
  ovulatory: '#fb923c',   // orange-400
  luteal: '#818cf8',      // indigo-400
}

const PHASE_BG: Record<CyclePhase, string> = {
  menstrual: 'bg-red-100 text-red-700',
  follicular: 'bg-purple-100 text-purple-700',
  ovulatory: 'bg-orange-100 text-orange-700',
  luteal: 'bg-indigo-100 text-indigo-700',
}

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulatory: 'Ovulatory',
  luteal: 'Luteal',
}

const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  menstrual: 'Your body is shedding the uterine lining. Rest and gentle movement support you best now.',
  follicular: 'Estrogen is rising — energy, creativity, and social drive are increasing.',
  ovulatory: 'Peak energy and confidence. Your body is primed for connection and high performance.',
  luteal: 'Progesterone rises. Focus on nourishing foods, rest, and grounding activities.',
}

export function getCurrentPhase(lastPeriodDate: string, cycleLength: number): PhaseInfo {
  const today = new Date()
  const last = new Date(lastPeriodDate)
  const rawDiff = differenceInDays(today, last)

  // Normalize to current cycle
  const dayOfCycle = (rawDiff % cycleLength) + 1

  // Phase boundaries (approximate)
  const menstrualEnd = 5
  const follicularEnd = Math.round(cycleLength * 0.45)
  const ovulatoryEnd = Math.round(cycleLength * 0.55)

  let phase: CyclePhase
  let startDay: number
  let endDay: number

  if (dayOfCycle <= menstrualEnd) {
    phase = 'menstrual'
    startDay = 1
    endDay = menstrualEnd
  } else if (dayOfCycle <= follicularEnd) {
    phase = 'follicular'
    startDay = menstrualEnd + 1
    endDay = follicularEnd
  } else if (dayOfCycle <= ovulatoryEnd) {
    phase = 'ovulatory'
    startDay = follicularEnd + 1
    endDay = ovulatoryEnd
  } else {
    phase = 'luteal'
    startDay = ovulatoryEnd + 1
    endDay = cycleLength
  }

  return {
    phase,
    dayOfCycle,
    daysRemaining: endDay - dayOfCycle + 1,
    startDay,
    endDay,
  }
}

export function getMonthPhases(lastPeriodDate: string, cycleLength: number, year: number, month: number): DayPhase[] {
  const monthStart = startOfMonth(new Date(year, month - 1))
  const monthEnd = endOfMonth(new Date(year, month - 1))
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const last = new Date(lastPeriodDate)

  const menstrualEnd = 5
  const follicularEnd = Math.round(cycleLength * 0.45)
  const ovulatoryEnd = Math.round(cycleLength * 0.55)

  return days.map((date) => {
    const rawDiff = differenceInDays(date, last)
    const dayOfCycle = ((rawDiff % cycleLength) + cycleLength) % cycleLength + 1

    let phase: CyclePhase
    if (dayOfCycle <= menstrualEnd) {
      phase = 'menstrual'
    } else if (dayOfCycle <= follicularEnd) {
      phase = 'follicular'
    } else if (dayOfCycle <= ovulatoryEnd) {
      phase = 'ovulatory'
    } else {
      phase = 'luteal'
    }

    return { date, phase, dayOfCycle }
  })
}

export function getNextPeriodDate(lastPeriodDate: string, cycleLength: number): Date {
  const last = new Date(lastPeriodDate)
  const today = new Date()
  const rawDiff = differenceInDays(today, last)
  const cyclesElapsed = Math.floor(rawDiff / cycleLength)
  return addDays(last, (cyclesElapsed + 1) * cycleLength)
}

export { PHASE_COLORS, PHASE_BG, PHASE_LABELS, PHASE_DESCRIPTIONS }
