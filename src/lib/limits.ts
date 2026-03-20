// Free plan usage limits — shared between client and server code.

export type Plan = 'free' | 'starter' | 'full'

export const WORD_LIMIT_FREE = 3000
export const EXPORT_LIMIT_FREE = 3
export const THESIS_LIMIT_FREE = 1
export const DIAGRAM_LIMIT_FREE = 2

export const EXPORT_LIMIT_STARTER = 10
export const THESIS_LIMIT_STARTER = 1
export const DIAGRAM_LIMIT_STARTER = 20

export const THESIS_LIMIT_FULL = 3

export const STARTER_PLAN_PRICE = 79000 // Rp 79.000
export const FULL_PLAN_PRICE = 149000 // Rp 149.000

export function isPaidPlan(plan: Plan): boolean {
  return plan === 'starter' || plan === 'full'
}

export interface UsageData {
  wordCount: number
  wordLimit: number
  exportCount: number
  exportLimit: number
  diagramCount: number
  diagramLimit: number
  plan: Plan
}
