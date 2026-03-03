// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

interface RegisterViewProps {
  onRegister: (email: string, password: string, fullName: string) => void
  isLoading: boolean
  error: string | null
}

export function RegisterView({ onRegister, isLoading, error }: RegisterViewProps) {
  return (
    <div>
      <h1>Register</h1>
    </div>
  )
}
