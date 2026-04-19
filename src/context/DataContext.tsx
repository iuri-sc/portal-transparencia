import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { type Projeto, type Despesa } from "../types"

interface DataContextValue {
  projetosCache: Projeto[] | null
  setProjetosCache: (data: Projeto[]) => void
  despesasCache: Despesa[] | null
  setDespesasCache: (data: Despesa[]) => void
  projetosFavoritos: number[]
  toggleFavoritos: (id: number) => void
}

const DataContext = createContext<DataContextValue | null>(null)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [projetosCache, setProjetosCache] = useState<Projeto[] | null>(null)
  const [despesasCache, setDespesasCache] = useState<Despesa[] | null>(null)

  const [projetosFavoritos, setProjetosFavoritos] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("portal-favoritos") || "[]") as number[]
    } catch {
      return []
    }
  })

  const toggleFavoritos = useCallback((id: number) => {
    setProjetosFavoritos(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem("portal-favoritos", JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <DataContext.Provider
      value={{
        projetosCache,
        setProjetosCache,
        despesasCache,
        setDespesasCache,
        projetosFavoritos,
        toggleFavoritos,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData precisa estar dentro do DataProvider")
  return ctx
}
