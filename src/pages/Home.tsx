import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../services/api"
import { LoadingSpinner, ErrorMessage } from "../components/StateComponents"
import { type Projeto, type Despesa } from "../types"

interface Demografico {
  populacao: number
  area: number
  densidade: number
  pib_per_capita: number
  idh: number
  alfabetizacao: number
  bairros: number
  escolas: number
  unidades_saude: number
  servidores: number
}

interface DadosPainel {
  projetos: Projeto[]
  despesas: Despesa[]
  demo: Demografico
}

const fmt = (n: number) => n.toLocaleString("pt-BR")
const fmtR = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
}

function MetricCard({ label, value, sub }: MetricCardProps) {
  return (
    <div className="metric-card">
      <span className="section-label">{label}</span>
      <span className="font-display text-2xl leading-none text-gray-900 dark:text-gray-50">
        {value}
      </span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
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
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 text-right font-mono text-[11px] text-gray-400">{pct}%</span>
    </div>
  )
}

export default function Home() {
  const [dados, setDados] = useState<DadosPainel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = async () => {
    setLoading(true)
    setError(null)
    try {
      const [p, d, dm] = await Promise.all([
        api.getProjetos(),
        api.getDespesas(),
        api.getDemograficos(),
      ])
      setDados({ projetos: p.data, despesas: d.data, demo: dm.data })
    } catch {
      setError("Não foi possível carregar os dados do painel")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  if (loading)
    return (
      <div className="page-wrapper">
        <LoadingSpinner text="Carregando painel municipal..." />
      </div>
    )
  if (error)
    return (
      <div className="page-wrapper">
        <ErrorMessage message={error} onRetry={carregar} />
      </div>
    )
  if (!dados) return null

  const { projetos, despesas, demo } = dados
  const ativos = projetos.filter(p => p.status === "Em andamento").length
  const concluidos = projetos.filter(p => p.status === "Concluído").length
  const totalOrc = projetos.reduce((s, p) => s + p.orcamento, 0)
  const totalGasto = projetos.reduce((s, p) => s + p.gasto, 0)
  const totalDesp = despesas.reduce((s, d) => s + d.valor, 0)
  const destaque = projetos.filter(p => p.status === "Em andamento").slice(0, 4)
  const cats = projetos.reduce<Record<string, number>>((a, p) => {
    a[p.categoria] = (a[p.categoria] ?? 0) + 1
    return a
  }, {})

  return (
    <main className="page-wrapper animate-in">
      {/* hero */}
      <div className="mb-8">
        <div className="mb-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label mb-1.5">Município de Vila Verde</p>
            <h1
              className="font-display font-normal text-gray-900 dark:text-gray-50"
              style={{ fontSize: "clamp(28px,4vw,42px)" }}
            >
              Painel de Transparência
            </h1>
          </div>
          <div className="flex gap-2.5">
            <Link to="/dados" className="btn-primary">
              Ver projetos
            </Link>
            <Link to="/despesas" className="btn-secondary">
              Ver despesas
            </Link>
          </div>
        </div>
        <div className="divider" />
      </div>
      {/* métricas */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="Total Projetos"
          value={fmt(projetos.length)}
          sub={`${ativos} em andamento`}
        />
        <MetricCard
          label="Orçamento Total"
          value={fmtR(totalOrc)}
          sub={`${Math.round((totalGasto / totalOrc) * 100)}% executado`}
        />
        <MetricCard label="Despesas" value={fmtR(totalDesp)} sub={`${despesas.length} empenhos`} />
        <MetricCard label="População" value={fmt(demo.populacao)} sub={`IDH ${demo.idh}`} />
        <MetricCard
          label="Concluídos"
          value={fmt(concluidos)}
          sub={`${projetos.filter(p => p.status === "Planejado").length} planejados`}
        />
        <MetricCard label="IDH municipal" value={demo.idh} sub={`Alfab. ${demo.alfabetizacao}%`} />
      </div>
      {/* grid central */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* projetos em andamento */}
        <section className="card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-normal text-gray-900 dark:text-gray-50">
              Projetos em andamento
            </h2>
            <Link to="/dados" className="font-mono text-xs text-green-500 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {destaque.map(p => (
              <div key={p.id} className="py-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-0.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {p.nome}
                    </p>
                    <p className="text-xs text-gray-400">de {fmtR(p.orcamento)}</p>
                  </div>
                </div>
                <ProgressBar value={p.gasto} max={p.orcamento} />
              </div>
            ))}
          </div>
        </section>
        {/* sidebar */}
        <aside className="flex flex-col gap-4">
          <section className="card p-5">
            <h2 className="font-display mb-4 text-lg font-normal text-gray-900 dark:text-gray-50">
              Por Área
            </h2>
            <div className="flex flex-col gap-3">
              {(Object.entries(cats) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{cat}</span>
                      <span className="font-mono text-gray-400">{count}</span>
                    </div>
                    <div className="h-0.5 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded bg-green-500"
                        style={{
                          width: `${(count / projetos.length) * 100}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>
          <section className="card p-5">
            <h2 className="font-display mb-4 text-lg font-normal text-gray-900 dark:text-gray-50">
              Dados do Município
            </h2>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  ["Área", `${fmt(demo.area)} km`],
                  ["Densidade", `${fmt(demo.densidade)} hab/km`],
                  ["PIB per capita", fmtR(demo.pib_per_capita)],
                  ["Escolas", String(demo.escolas)],
                  ["Unid. de saúde", String(demo.unidades_saude)],
                  ["Servidores", fmt(demo.servidores)],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">{k}</span>
                  <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      <p className="section-label mt-10 text-center">Dados atualizados em dezembro/2024</p>
    </main>
  )
}
