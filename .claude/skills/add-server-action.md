When creating a new server action in src/actions/:

1. Add 'use server' directive at top
2. Import createClient from @/lib/supabase/server (if DB needed)
3. Name: <verb><Domain>Action (e.g., createThesisAction, updateSectionAction)
4. Return type: Promise<{ error?: string }> or Promise<{ data?: T; error?: string }>
5. Handle errors inline — return { error: message }, never throw
6. Keep each function single-responsibility
7. Call pure services from @/services/ for business logic (not inline)

Example structure:
```ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function createThesisAction(
  params: { title: string; userId: string }
): Promise<{ data?: Thesis; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('theses')
    .insert({ title: params.title, user_id: params.userId })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}
```

Reference: src/actions/auth.actions.ts
