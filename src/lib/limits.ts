// Free plan usage limits — shared between client and server code.

export const WORD_LIMIT_FREE = 5000
export const EXPORT_LIMIT_FREE = 100
  
export interface UsageData {
  wordCount: number
  wordLimit: number
  exportCount: number
  exportLimit: number
  plan: 'free' | 'pro'
}
