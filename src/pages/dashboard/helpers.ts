/**
 * Dashboard helper utilities — greeting, date formatting, day calculation.
 */

export function getGreeting(lang: 'en' | 'bn'): string {
  const hour = new Date().getHours()
  if (hour < 12) return lang === 'bn' ? 'সুপ্রভাত' : 'Good morning'
  if (hour < 17) return lang === 'bn' ? 'শুভ অপরাহ্ণ' : 'Good afternoon'
  return lang === 'bn' ? 'শুভ সন্ধ্যা' : 'Good evening'
}

export function getDayNumber(planStartDate: string): number {
  const start = new Date(planStartDate)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays + 1)
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const BN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
]
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toBnDigits(n: number): string {
  return String(n).split('').map((d) => BN_DIGITS[Number(d)] ?? d).join('')
}

export function formatDate(lang: 'en' | 'bn'): string {
  const now = new Date()
  const day = now.getDate()
  const month = now.getMonth()
  const year = now.getFullYear()

  if (lang === 'bn') {
    return `${toBnDigits(day)} ${BN_MONTHS[month]}, ${toBnDigits(year)}`
  }
  return `${EN_MONTHS[month]} ${day}, ${year}`
}

export function toBnNumber(n: number): string {
  return toBnDigits(n)
}

export const TASK_TYPE_COLORS: Record<string, string> = {
  lecture: 'bg-accent/10 text-accent',
  practice: 'bg-chart-3/10 text-chart-3',
  revision: 'bg-chart-2/10 text-chart-2',
  test: 'bg-chart-5/10 text-chart-5',
}
