import { useState, useEffect, useMemo } from "react"
import { api } from "../services/api"
import { useData } from "../context/DataContext"
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/StateComponents"
import { type Despesa, type DespesaStatusType, type OrdemType } from "../types/index"

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR")

const ST: Record<DespesaStatusType, string> = {
  Pago: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200",
  "Em processamento": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  Pendente: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-3a00",
}

const CATS = [
  "Todos",
  "Pessoal",
  "Saúde",
  "Educação",
  "Infraestrutura",
  "Assistência Social",
  "Meio Ambiente",
  "Administração",
]

export default function Despesas() {
  const { despesasCache, setDespesasCache } = useData()
  const [despesas, setDespesas] = useState<Despesa[]>(despesasCache ?? [])
  const [loading, setLoading] = useState(!despesasCache)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [cat, setCat] = useState("Todas")
  const [stFiltro, setStFiltro] = useState("Todos")
  const [ordem, setOrdem] = useState<OrdemType>("orcamento-desc")

  const carregar = async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await api.getDespesas()
      setDespesas(r.data)
      setDespesasCache(r.data)
    } catch {
      setError("Falha ao carregar despesas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!despesasCache) carregar()
  }, [])

  const filtradas = useMemo(() => {
    let r = [...despesas]
    if (busca.trim()) {
      const q = busca.toLowerCase()
      r = r.filter(
        d =>
          d.descricao.toLowerCase().includes(q) ||
          d.fornecedor.toLowerCase().includes(q) ||
          d.empenho.toLowerCase().includes(q)
      )
    }
    if (cat !== "Todas") r = r.filter(d => d.categoria === cat)
    if (stFiltro !== "Todos") r = r.filter(d => d.status === stFiltro)
    r.sort((a, b) => {
      if (ordem === "orcamento-desc") return b.valor - a.valor
      if (ordem === "orcamento-asc") return a.valor - b.valor
      return new Date(a.data).getTime() - new Date(b.data).getTime()
    })
    return r
  }, [despesas, busca, cat, stFiltro, ordem])

  const total = filtradas.reduce((s, d) => s + d.valor, 0)
  const totalGeral = despesas.reduce((s, d) => s + d.valor, 0)

  const porCat = useMemo(
    () =>
      despesas.reduce<Record<string, number>>((a, d) => {
        a[d.categoria] = (a[d.categoria] ?? 0) + d.valor
        return a
      }, {}),
    [despesas]
  )

  if (loading)
    return (
      <div className="page-wrapper">
        <LoadingSpinner text="Carregando despesas..." />
      </div>
    )
  if (error)
    return (
      <div className="page-wrapper">
        <ErrorMessage message={error} onRetry={carregar} />
      </div>
    )

  return (
    <main className="page-wrapper animate-in">
      <div className="mb-7">
        <p className="section-label mb-1.5">Execução financeira</p>
        <h1
          className="font-display font-normal text-gray-900 dark:text-gray-50"
          style={{ fontSize: "clamp(24px,3vw,38px)" }}
        >
          Despesas Municipais
        </h1>
        <div className="divider" />
      </div>
      {/* cards resumo */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            ["Total registrado", fmt(totalGeral), `${despesas.length} empenhos`],
            ["Maior despesa", fmt(Math.max(...despesas.map(d => d.valor))), "Folha de pagamento"],
            [
              "Pagos",
              fmt(despesas.filter(d => d.status === "Pago").reduce((s, d) => s + d.valor, 0)),
              `${despesas.filter(d => d.status === "Pago").length} empenhos`,
            ],
            [
              "Em Processamento",
              fmt(
                despesas
                  .filter(d => d.status === "Em processamento")
                  .reduce((s, d) => s + d.valor, 0)
              ),
              "aguardando liquidação",
            ],
          ] as [string, string, string][]
        ).map(([l, v, s]) => (
          <div key={l} className="metric-card">
            <span className="section-label">{l}</span>
            <span className="font-display text-xl leading-none text-gray-900 dark:text-gray-50">
              {v}
            </span>
            <span className="text-xs text-gray-400">{s}</span>
          </div>
        ))}
      </div>
      {/* distribuição por categoria */}
      <div className="card mb-5 p-5">
        <h2 className="font-display mb-4 text-lg font-normal text-gray-900 italic dark:text-gray-50">
          Distribuição por Área
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {(Object.entries(porCat) as [string, number][])
            .sort((a, b) => b[1] - a[1])
            .map(([c, v]) => (
              <div key={c} className="min-w-30 flex-1">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{c}</span>
                  <span className="font-mono text-gray-400">
                    {Math.round((v / totalGeral) * 100)}%
                  </span>
                </div>
                <div className="overflow-hiddem h-0.5 rounded bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded bg-amber-400"
                    style={{ width: `${(v / totalGeral) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <input
          type="text"
          placeholder="Buscar por descrição, fornecedor ou empenho..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="input-field min-w-48 flex-1"
        />
        <select value={cat} onChange={e => setCat(e.target.value)} className="input-field min-w-32">
          {CATS.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={stFiltro}
          onChange={e => setStFiltro(e.target.value)}
          className="input-field min-w-36"
        >
          {["Todos", "Pago", "Em processamento", "Pendente"].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={ordem}
          onChange={e => setOrdem(e.target.value as OrdemType)}
          className="input-field min-w-36"
        >
          <option value="orcamento-asc">Maior valor</option>
          <option value="orcamento-desc">Menor valor</option>
        </select>
        {(busca || cat !== "Todas" || stFiltro !== "Todos") && (
          <button
            onClick={() => {
              setBusca("")
              setCat("Todas")
              setStFiltro("Todos")
            }}
            className="px-2 text-sm text-red-500"
          >
            Limpar X
          </button>
        )}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs text-gray-400">{filtradas.length} registros</p>
        {filtradas.length > 0 && (
          <p className="font-mono text-sm text-gray-500">
            Total filtrado:{" "}
            <strong className="text-gray-800 dark:text-gray-200">{fmt(total)}</strong>
          </p>
        )}
      </div>
      {filtradas.length === 0 ? (
        <EmptyState title="Nenhuma despesa encontrada" />
      ) : (
        <div className="table-wrapper overflow-x-auto">
          <table className="w-full min-w-160 border-collapse">
            <thead>
              <tr>
                <th className="th">Descrição</th>
                <th className="th">Categoria</th>
                <th className="th">Fornecedor</th>
                <th className="th-right">Empenho</th>
                <th className="th-right">Data</th>
                <th className="th-right">Valor</th>
                <th className="th-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(d => (
                <tr key={d.id} className="tr-hover">
                  <td className="td max-w-xs">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                      {d.descricao}
                    </p>
                  </td>
                  <td className="td">
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-gray-500 dark:bg-gray-800">
                      {d.categoria}
                    </span>
                  </td>
                  <td className="td text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {d.fornecedor}
                  </td>
                  <td className="td text-right font-mono text-xs whitespace-nowrap text-gray-400">
                    {d.empenho}
                  </td>
                  <td className="td text-right font-mono text-xs whitespace-nowrap text-gray-400">
                    {fmtDate(d.data)}
                  </td>
                  <td className="td text-right font-mono text-sm font-medium whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {fmt(d.valor)}
                  </td>
                  <td className="td text-right">
                    <span
                      className={`badge ${ST[d.status as DespesaStatusType] ?? "bg-gray-100 text-gray-600"} whitespace-nowrap`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <td colSpan={5} className="px-4 py-3 font-mono text-xs text-gray-400">
                  SUBTOTAL ({filtradas.length} registros)
                </td>
                <td className="px-4 py-3 text-right font-mono text-base font-semibold text-gray-900 dark:text-gray-100">
                  {fmt(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </main>
  )
}
