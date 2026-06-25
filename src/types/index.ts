// ─── Backend response types (mirrors Django models & serializers) ───────────

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type FraudCategory =
  | 'PHISHING'
  | 'PRIZE_FRAUD'
  | 'IMPERSONATION'
  | 'INVESTMENT_FRAUD'
  | 'ROMANCE_SCAM'
  | 'NONE'

export type ContactType =
  | 'PHONE'
  | 'WHATSAPP'
  | 'BANK_ACCOUNT'
  | 'URL'
  | 'EMAIL'
  | 'ORG_NAME'

export type Agency = 'EFCC' | 'NITDA' | 'CBN' | 'NPF'

export interface ThreatActor {
  contact_type: ContactType
  contact_value: string
  label: string
  report_count?: number
}

export interface AnalyzeResponse {
  is_scam: boolean
  scam_probability: number        // 0–100
  threat_level: ThreatLevel
  fraud_category: FraudCategory
  flagged_phrases: string[]
  explanation: string
  recommended_action: string
  threat_actors: ThreatActor[]
  social_proof: string | null
  known_actor: (ThreatActor & { report_count: number }) | null
  fingerprint: string | null      // null when is_scam is false (no ScamReport created)
}

export interface StatsResponse {
  total_scans: number
  top_fraud_categories: { fraud_category: FraudCategory; count: number }[]
  top_threat_actors: {
    contact_type: ContactType
    contact_value: string
    label: string
    report_count: number
  }[]
}

export interface ReportResponse {
  message: string
  agency: Agency
  scam_category: FraudCategory
  threat_level: ThreatLevel
}

// ─── UI state types ──────────────────────────────────────────────────────────

export type AnalysisTab = 'text' | 'url' | 'image' | 'audio'

export type ScanState = 'idle' | 'scanning' | 'done' | 'error'

export interface OnboardingStep {
  id: number
  title: string
  subtitle: string
  icon: string
}
