export type StatusType = "Em andamento" | "Concluído" | "Planejado"

export type DespesaStatusType = "Pago" | "Em processamento" | "Pendente"

export type OrdemType = "nome" | "orcamento-desc" | "orcamento-asc" | "execucao"

export interface Projeto {
  id: number
  nome: string
  categoria: string
  status: StatusType
  orcamento: number
  gasto: number
  inicio: string
  termino: string
  responsavel: string
  descricao: string
}

export interface Despesa {
  id: number
  descricao: string
  categoria: string
  valor: number
  data: string
  fornecedor: string
  empenho: string
  status: string
}
