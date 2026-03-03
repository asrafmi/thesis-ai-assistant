// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

interface LoginViewProps {
  onLogin: (email: string, password: string) => void
  isLoading: boolean
  error: string | null
}

export function LoginView({ onLogin, isLoading, error }: LoginViewProps) {
  return (
    <div>
      <h1>Login</h1>
    </div>
  )
}
