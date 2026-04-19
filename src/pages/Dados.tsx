import { useState, useEffect, useMemo } from "react"
import { api } from "../services/api.js"
import { useData } from "../context/DataContext"
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/StateComponents"
import { type Projeto, type StatusType, type OrdemType } from "../types/"

type ViewMode = "tabela" | "cards"

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR")

const STATUS: Record<StatusType, string> = {
  "Em andamento": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200",
  Concluído: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  Planejado: "bg-amber-300/20 text-amber-600 dark:text-amber-300",
}

const STATUS_DOT: Record<StatusType, string> = {
  "Em andamento": "bg-green-500",
  Concluído: "bg-blue-500",
  Planejado: "bg-amber-400",
}

const CATS = [
  "Todas",
  "Saúde",
  "Educação",
  "Infraestrutura",
  "Assistência Social",
  "Meio Ambiente",
  "Segurança",
  "Tecnologia",
  "Administração",
]
const STATUS_LIST = ["Todos", "Em Andamento", "Concluído", "Planejado"]

interface StatusBadgeProps {
  status: StatusType
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${STATUS[status] ?? "bg-gray-100 text-gray-600"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  )
}

interface ProgressBarProps {
  value: number
  max: number
}

function ProgressBar({ value, max }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const color = pct > 90 ? "bg-red-400" : pct > 60 ? "bg-amber-400" : "bg-green-500"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 text-right font-mono text-[11px] text-gray-400">{pct}%</span>
    </div>
  )
}

export default function Dados() {
  const { projetosCache, setProjetosCache, projetosFavoritos, toggleFavoritos } = useData()
  const [projetos, setProjetos] = useState<Projeto[]>(projetosCache ?? [])
  const [loading, setLoading] = useState(!projetosCache)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("Todas")
  const [status, setStatus] = useState("Todos")
  const [ordem, setOrdem] = useState<OrdemType>("nome")
  const [view, setView] = useState<ViewMode>("tabela")
  const [ativo, setAtivo] = useState<Projeto | null>(null)

  const carregar = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getProjetos()
      setProjetos(res.data)
      setProjetosCache(res.data)
    } catch {
      setError("Falha ao carregar projetos. Verifique sua conexão")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!projetosCache) carregar()
  }, [])

  const filtrados = useMemo(() => {
    let r = [...projetos]
    if (busca.trim()) {
      const q = busca.toLowerCase()
      r = r.filter(
        p =>
          p.nome.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          p.responsavel.toLowerCase().includes(q)
      )
    }
    if (categoria !== "Todas") r = r.filter(p => p.categoria === categoria)
    if (status !== "Todos") r = r.filter(p => p.status === status)
    r.sort((a, b) => {
      if (ordem === "nome") return a.nome.localeCompare(b.nome)
      if (ordem === "orcamento-desc") return b.orcamento - a.orcamento
      if (ordem === "orcamento-asc") return a.orcamento - b.orcamento
      return b.gasto / b.orcamento - a.gasto / a.orcamento
    })
    return r
  }, [projetos, busca, categoria, status, ordem])

  if (loading)
    return (
      <div className="page-wrapper">
        <LoadingSpinner text="Buscando projetos via API..." />
      </div>
    )
  if (error)
    return (
      <div className="page-wrapper">
        <ErrorMessage message={error} onRetry={carregar} />
      </div>
    )

  const limpar = busca || categoria !== "Todas" || status !== "Todos"

  return (
    <main className="page-wrapper animate-in">
      {/* header */}
      <div className="mb-7">
        <p className="section-label mb-1.5">Listagem completa</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1
            className="font-display font-normal text-gray-900 dark:text-gray-50"
            style={{ fontSize: "clamp(24px,3vw,38px)" }}
          >
            Projetos municipais
          </h1>
          <div className="flex gap-2">
            {(["tabela", "cards"] as ViewMode[]).map(m => (
              <button
                key={m}
                onClick={() => setView(m)}
                className={`rounded-lg border px-3.5 py-1.5 font-mono text-xs transition-all ${
                  view === m
                    ? "border-transparent bg-green-700 text-white dark:bg-green-500"
                    : "boder-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-700"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="divider" />
      </div>
      {/* filtros */}
      <div className="boder-gray-200 mb-5 flex flex-wrap items-center gap-3 rounded-xl border bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <input
          type="text"
          placeholder="Busca por nome, categoria..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="input-field min-w-48 flex-1"
        />
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          className="input-field min-w-36"
        >
          {CATS.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input-field min-w-32"
        >
          {STATUS_LIST.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={ordem}
          onChange={e => setOrdem(e.target.value as OrdemType)}
          className="input-field min-w-36"
        >
          <option value="ordem">Nome (A-Z)</option>
          <option value="orcamento-desc">Maior orçamento</option>
          <option value="orcamento-asc">Menor orçamento</option>
          <option value="execucao">% Execução</option>
        </select>
        {limpar && (
          <button
            onClick={() => {
              setBusca("")
              setCategoria("Todas")
              setStatus("Todos")
            }}
            className="px-2 text-sm text-red-500 hover:text-red-600"
          >
            Limpar X
          </button>
        )}
      </div>
      <p className="mb-4 font-mono text-xs text-gray-400">
        {filtrados.length} projeto{filtrados.length !== 1 ? "s" : ""} encontrado
        {filtrados.length !== 1 ? "s" : ""}
      </p>
      {filtrados.length === 0 ? (
        <EmptyState />
      ) : view === "tabela" ? (
        <div className="table-wrapper overflow-x-auto">
          <table className="w-full min-w-175 border-collapse">
            <thead>
              <tr>
                <th className="th w-10"></th>
                <th className="th">Projeto</th>
                <th className="th">Categoria</th>
                <th className="th">Status</th>
                <th className="th-right">Orçamento</th>
                <th className="th min-w-35">Execução</th>
                <th className="th-right">Término</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id} className="tr-hover" onClick={() => setAtivo(p)}>
                  <td className="td pl-4">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        toggleFavoritos(p.id)
                      }}
                      className={`rounded p-1 text-sm transition-colors ${projetosFavoritos.includes(p.id) ? "text-amber-400" : "text-gray-300 hover:text-amber-400"}`}
                    >
                      {projetosFavoritos.includes(p.id) ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="td">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.nome}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{p.responsavel}</p>
                  </td>
                  <td className="td">
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {p.categoria}
                    </span>
                  </td>
                  <td className="td">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="td text-right font-mono text-sm text-gray-400 dark:text-gray-200">
                    {fmt(p.orcamento)}
                  </td>
                  <td className="td">
                    <ProgressBar value={p.gasto} max={p.orcamento} />
                  </td>
                  <td className="td tex-right font-mono text-xs whitespace-nowrap text-gray-400">
                    {fmtDate(p.termino)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map(p => (
            <div
              key={p.id}
              onClick={() => setAtivo(p)}
              className="card cursor-pointer p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="section-label mb-1">{p.categoria}</p>
                  <h3 className="text-sm leading-snug font-medium text-gray-800 dark:text-gray-200">
                    {p.nome}
                  </h3>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    toggleFavoritos(p.id)
                  }}
                  className={`shrink-0 text-sm ${projetosFavoritos.includes(p.id) ? "text-amber-400" : "text-gray-300 hover:text-amber-400"}`}
                >
                  {projetosFavoritos.includes(p.id) ? "★" : "☆"}
                </button>
              </div>
              <p className="mb-4 line-clamp-2 text-xs text-gray-400">{p.descricao}</p>
              <div className="mb-3 flex items-center justify-between">
                <StatusBadge status={p.status} />
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                  {fmt(p.orcamento)}
                </span>
              </div>
              <ProgressBar value={p.gasto} max={p.orcamento} />
            </div>
          ))}
        </div>
      )}
      {/* modal */}
      {ativo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAtivo(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="section-label mb-1.5">{ativo.categoria}</p>
                <h2 className="font-display text-2xl leading-snug font-normal text-gray-900 dark:text-gray-50">
                  {ativo.nome}
                </h2>
              </div>
              <button
                onClick={() => setAtivo(null)}
                className="shrink-0 p-1 text-lg text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            </div>
            <StatusBadge status={ativo.status} />
            <p className="tex-sm my-4 leading-relaxed text-gray-500 dark:text-gray-400">
              {ativo.descricao}
            </p>
            <div className="mb-4 grid grid-cols-2 gap-2.5">
              {(
                [
                  ["Responsável", ativo.responsavel],
                  ["Início", fmtDate(ativo.inicio)],
                  ["Término previsto", fmtDate(ativo.inicio)],
                  ["Orçamento", fmt(ativo.orcamento)],
                  ["Empenhado", fmt(ativo.gasto)],
                  ["Saldo", fmt(ativo.orcamento - ativo.gasto)],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="section-label mb-1">{k}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{v}</p>
                </div>
              ))}
            </div>
            <p className="mb-2 text-xs text-gray-400">Execução financeira</p>
          </div>
        </div>
      )}
    </main>
  )
}
