'use server'

// SERVER ACTIONS — Usage tracking for free plan limits. No React hooks, no JSX.

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { WORD_LIMIT_FREE, EXPORT_LIMIT_FREE, EXPORT_LIMIT_STARTER, DIAGRAM_LIMIT_FREE, DIAGRAM_LIMIT_STARTER } from '@/lib/limits'
import type { UsageData } from '@/lib/limits'

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export async function getUsageAction(): Promise<{ data?: UsageData; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('plan, word_count, word_count_reset_at, diagram_count, diagram_count_reset_at')
    .eq('id', auth.userId)
    .single()

  if (profileError) return { error: profileError.message }

  const now = new Date()
  const resetAt = profile.word_count_reset_at ? new Date(profile.word_count_reset_at) : null

  // Reset word count if this is a new month
  let wordCount = profile.word_count
  if (!resetAt || !isSameMonth(resetAt, now)) {
    wordCount = 0
    await supabase
      .from('profiles')
      .update({ word_count: 0, word_count_reset_at: now.toISOString() })
      .eq('id', auth.userId)
  }

  // Count exports this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count: exportCount } = await supabase
    .from('exports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', auth.userId)
    .gte('created_at', startOfMonth)

  const exportLimit = profile.plan === 'free' ? EXPORT_LIMIT_FREE
    : profile.plan === 'starter' ? EXPORT_LIMIT_STARTER
    : Infinity

  // Diagram count with monthly reset
  const diagramResetAt = profile.diagram_count_reset_at ? new Date(profile.diagram_count_reset_at) : null
  let diagramCount = profile.diagram_count
  if (!diagramResetAt || !isSameMonth(diagramResetAt, now)) {
    diagramCount = 0
    await supabase
      .from('profiles')
      .update({ diagram_count: 0, diagram_count_reset_at: now.toISOString() })
      .eq('id', auth.userId)
  }

  const diagramLimit = profile.plan === 'free' ? DIAGRAM_LIMIT_FREE
    : profile.plan === 'starter' ? DIAGRAM_LIMIT_STARTER
    : Infinity

  return {
    data: {
      wordCount,
      wordLimit: WORD_LIMIT_FREE,
      exportCount: exportCount ?? 0,
      exportLimit,
      diagramCount,
      diagramLimit,
      plan: profile.plan,
    },
  }
}
