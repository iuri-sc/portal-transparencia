interface LoadingSpinnerProps {
  text?: string
}

export function LoadingSpinner({ text = "Carregando dados..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="border-t-gold-400 h-9 w-9 rounded-full border-2 border-gray-200 dark:border-gray-700"
        style={{ animation: "spin 0.9s linear infinite" }}
      />
      <p className="font-mono text-xs tracking-widest text-gray-400 uppercase">{text}</p>
    </div>
  )
}

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl dark:bg-red-900/20">
        !
      </div>
      <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Falha ao carregar</h3>
      <p className="max-w-sm text-sm text-gray-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-2">
          Tentar novamente
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title?: string
  subtitle?: string
}

export function EmptyState({
  title = "Nenhum resultado",
  subtitle = "Tentar ajustar os filtros de busca",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="text-4xl opacity-20">◻</div>
      <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-sm text-gray-400">{subtitle}</p>s
    </div>
  )
}
