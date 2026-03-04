When implementing a new screen/feature, follow this layer order:

1. SERVICE (src/services/) — write pure TypeScript functions first
   - No React, no Next.js imports
   - Prefix comment: // BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.
   - Return typed data
   - Example: buildDefaultSections(), validateThesisData()

2. ACTION (src/actions/) — wire service to Supabase/AI
   - 'use server' directive
   - Return { data?, error? }
   - Call services for any logic, keep action thin
   - Reference: src/actions/auth.actions.ts

3. HOOK (src/hooks/) — manage React state
   - Prefix comment: // FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.
   - useState for isLoading, error, data
   - Call actions, set error state on failure, route on success
   - Reference: src/hooks/useAuth.ts

4. VIEW (src/views/) — pure presentation
   - Prefix comment: // PRESENTATION LAYER — pure JSX only. No hooks, no business logic.
   - All props interface fields readonly
   - No useRouter, no useState — receive callbacks as props
   - Reference: src/views/auth/LoginView.tsx

5. SCREEN (src/screens/) — thin container
   - 'use client' directive
   - Only: call hook + render view with props
   - No logic, no JSX beyond rendering the View
   - Reference: src/screens/LoginScreen.tsx

6. REGISTER — in src/app/<route>/page.tsx, import and render Screen

Layer data flow:
  page.tsx → Screen → View
                ↑
              Hook → Action → Service
                   → Store (for shared UI state)

Reference files:
- src/actions/auth.actions.ts
- src/hooks/useAuth.ts
- src/screens/LoginScreen.tsx
- src/views/auth/LoginView.tsx
