import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ThreatLevel, FraudCategory } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function threatMeta(level: ThreatLevel) {
  switch (level) {
    case 'CRITICAL': return { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', ring: 'ring-red-500/30', text: 'text-red-400', bar: 'bg-red-500' }
    case 'HIGH':     return { label: 'High',     color: '#F97316', bg: 'rgba(249,115,22,0.12)', ring: 'ring-orange-500/30', text: 'text-orange-400', bar: 'bg-orange-500' }
    case 'MEDIUM':   return { label: 'Medium',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', ring: 'ring-amber-500/30', text: 'text-amber-400', bar: 'bg-amber-500' }
    case 'LOW':      return { label: 'Low',       color: '#10B981', bg: 'rgba(16,185,129,0.12)', ring: 'ring-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-500' }
  }
}

export function categoryLabel(cat: FraudCategory) {
  const map: Record<FraudCategory, string> = {
    PHISHING: 'Phishing',
    PRIZE_FRAUD: 'Prize Fraud',
    IMPERSONATION: 'Impersonation',
    INVESTMENT_FRAUD: 'Investment Fraud',
    ROMANCE_SCAM: 'Romance Scam',
    NONE: 'No Threat',
  }
  return map[cat] ?? cat
}

export function categoryIcon(cat: FraudCategory) {
  const map: Record<FraudCategory, string> = {
    PHISHING: '🎣',
    PRIZE_FRAUD: '🎰',
    IMPERSONATION: '🎭',
    INVESTMENT_FRAUD: '💸',
    ROMANCE_SCAM: '💔',
    NONE: '✅',
  }
  return map[cat] ?? '⚠️'
}

export function contactTypeIcon(type: string) {
  const map: Record<string, string> = {
    PHONE: '📞',
    WHATSAPP: '💬',
    BANK_ACCOUNT: '🏦',
    URL: '🔗',
    EMAIL: '📧',
    ORG_NAME: '🏢',
  }
  return map[type] ?? '⚠️'
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}
