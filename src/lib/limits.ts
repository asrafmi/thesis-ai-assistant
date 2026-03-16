// Free plan usage limits — shared between client and server code.

export const WORD_LIMIT_FREE = process.env.NEXT_PUBLIC_WORD_LIMIT_FREE ? parseInt(process.env.NEXT_PUBLIC_WORD_LIMIT_FREE) : 5000
export const EXPORT_LIMIT_FREE = process.env.NEXT_PUBLIC_EXPORT_LIMIT_FREE ? parseInt(process.env.NEXT_PUBLIC_EXPORT_LIMIT_FREE) : 3
  
export interface UsageData {
  wordCount: number
  wordLimit: number
  exportCount: number
  exportLimit: number
  plan: 'free' | 'pro'
}
