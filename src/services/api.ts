// Serviço de API simulada com dados realistas de um município fictício
// Em produção, substituir pela URL real da API

import { type Projeto, type Despesa } from "../types/index"

const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

export type CategoriaProjeto =
  | "Saúde"
  | "Infraestrutura"
  | "Educação"
  | "Assistência Social"
  | "Meio Ambiente"
  | "Segurança"
  | "Tecnologia"

export type CategoriaDespesa =
  | "Pessoal"
  | "Infraestrutura"
  | "Saúde"
  | "Educação"
  | "Administração"
  | "Assistência Social"
  | "Meio Ambiente"

export type StatusDespesa = "Pago" | "Em processamento" | "Pendente"

export interface Demograficos {
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

export interface ApiResponse<T> {
  data: T
}

const PROJETOS: Projeto[] = [
  {
    id: 1,
    nome: "Reforma da UBS Central",
    categoria: "Saúde",
    status: "Em andamento",
    orcamento: 2850000,
    gasto: 1420000,
    inicio: "2024-03-01",
    termino: "2025-06-30",
    responsavel: "Sec. de Saúde",
    descricao:
      "Reforma completa da Unidade Básica de Saúde do centro, incluindo ampliação do número de consultórios e modernização dos equipamentos.",
  },
  {
    id: 2,
    nome: "Pavimentação Bairro Novo Horizonte",
    categoria: "Infraestrutura",
    status: "Em andamento",
    orcamento: 4200000,
    gasto: 3100000,
    inicio: "2023-11-15",
    termino: "2025-03-31",
    responsavel: "Sec. de Obras",
    descricao:
      "Pavimentação asfáltica de 18 km de vias urbanas no bairro Novo Horizonte, incluindo meio-fio e sarjetas.",
  },
  {
    id: 3,
    nome: "Construção da EMEF Prof. Maria Oliveira",
    categoria: "Educação",
    status: "Concluído",
    orcamento: 6500000,
    gasto: 6480000,
    inicio: "2022-06-01",
    termino: "2024-12-20",
    responsavel: "Sec. de Educação",
    descricao:
      "Construção de nova escola municipal com capacidade para 800 alunos, quadra poliesportiva e laboratório de informática.",
  },
  {
    id: 4,
    nome: "Iluminação LED — Área Central",
    categoria: "Infraestrutura",
    status: "Em andamento",
    orcamento: 1800000,
    gasto: 900000,
    inicio: "2024-09-01",
    termino: "2025-08-31",
    responsavel: "Sec. de Obras",
    descricao:
      "Substituição de 2.400 luminárias convencionais por tecnologia LED na área central, com redução prevista de 60% no consumo.",
  },
  {
    id: 5,
    nome: "Programa Bolsa Família Municipal",
    categoria: "Assistência Social",
    status: "Em andamento",
    orcamento: 3600000,
    gasto: 2700000,
    inicio: "2024-01-01",
    termino: "2024-12-31",
    responsavel: "Sec. de Assistência",
    descricao:
      "Programa de complementação de renda para 1.200 famílias em situação de vulnerabilidade social.",
  },
  {
    id: 6,
    nome: "Parque Linear Ribeirão das Flores",
    categoria: "Meio Ambiente",
    status: "Planejado",
    orcamento: 5200000,
    gasto: 0,
    inicio: "2025-03-01",
    termino: "2026-09-30",
    responsavel: "Sec. de Meio Ambiente",
    descricao:
      "Criação de parque linear de 3,2 km às margens do Ribeirão das Flores com ciclovias, pistas de caminhada e recuperação da mata ciliar.",
  },
  {
    id: 7,
    nome: "Sistema de Monitoramento — Segurança Pública",
    categoria: "Segurança",
    status: "Concluído",
    orcamento: 980000,
    gasto: 975000,
    inicio: "2024-02-01",
    termino: "2024-09-30",
    responsavel: "Sec. de Segurança",
    descricao:
      "Instalação de 180 câmeras de monitoramento inteligente integradas à central de operações.",
  },
  {
    id: 8,
    nome: "Creche Municipal Jardim das Rosas",
    categoria: "Educação",
    status: "Em andamento",
    orcamento: 3200000,
    gasto: 800000,
    inicio: "2024-10-01",
    termino: "2026-04-30",
    responsavel: "Sec. de Educação",
    descricao:
      "Construção de creche com capacidade para 240 crianças de 0 a 3 anos, com refeitório, berçário e área de recreação.",
  },
  {
    id: 9,
    nome: "Recapeamento Av. dos Expedicionários",
    categoria: "Infraestrutura",
    status: "Concluído",
    orcamento: 1450000,
    gasto: 1430000,
    inicio: "2024-04-15",
    termino: "2024-11-30",
    responsavel: "Sec. de Obras",
    descricao:
      "Recapeamento de 7,8 km da Avenida dos Expedicionários com nova sinalização horizontal e vertical.",
  },
  {
    id: 10,
    nome: "Ampliação do Hospital Municipal",
    categoria: "Saúde",
    status: "Planejado",
    orcamento: 12000000,
    gasto: 0,
    inicio: "2025-06-01",
    termino: "2027-12-31",
    responsavel: "Sec. de Saúde",
    descricao:
      "Construção de novo bloco hospitalar com 80 leitos, UTI e centro cirúrgico de alta complexidade.",
  },
  {
    id: 11,
    nome: "Digitalização dos Serviços Municipais",
    categoria: "Tecnologia",
    status: "Em andamento",
    orcamento: 760000,
    gasto: 380000,
    inicio: "2024-07-01",
    termino: "2025-06-30",
    responsavel: "Sec. de Administração",
    descricao:
      "Implantação de portal digital para acesso a 45 serviços municipais, reduzindo filas e deslocamentos dos cidadãos.",
  },
  {
    id: 12,
    nome: "Praças e Áreas Verdes — Bairros Periféricos",
    categoria: "Meio Ambiente",
    status: "Em andamento",
    orcamento: 890000,
    gasto: 420000,
    inicio: "2024-05-01",
    termino: "2025-04-30",
    responsavel: "Sec. de Meio Ambiente",
    descricao:
      "Revitalização e criação de 12 praças e parques de bairro com playgrounds, academia ao ar livre e arborização.",
  },
]

const DESPESAS: Despesa[] = [
  {
    id: 1,
    descricao: "Folha de Pagamento — Servidores Municipais",
    categoria: "Pessoal",
    valor: 8450000,
    data: "2024-11-01",
    fornecedor: "Folha Municipal",
    empenho: "EM-2024-11-001",
    status: "Pago",
  },
  {
    id: 2,
    descricao: "Manutenção da Frota Municipal",
    categoria: "Infraestrutura",
    valor: 184500,
    data: "2024-11-05",
    fornecedor: "AutoServ Ltda",
    empenho: "EM-2024-11-024",
    status: "Pago",
  },
  {
    id: 3,
    descricao: "Aquisição de Medicamentos — Farmácia Básica",
    categoria: "Saúde",
    valor: 620000,
    data: "2024-11-08",
    fornecedor: "MedSupply S.A.",
    empenho: "EM-2024-11-031",
    status: "Pago",
  },
  {
    id: 4,
    descricao: "Merenda Escolar — Rede Municipal",
    categoria: "Educação",
    valor: 340000,
    data: "2024-11-10",
    fornecedor: "AgroFresh Cooperativa",
    empenho: "EM-2024-11-045",
    status: "Pago",
  },
  {
    id: 5,
    descricao: "Energia Elétrica — Prédios Públicos",
    categoria: "Infraestrutura",
    valor: 215000,
    data: "2024-11-12",
    fornecedor: "CPFL Energia",
    empenho: "EM-2024-11-052",
    status: "Pago",
  },
  {
    id: 6,
    descricao: "Serviços de Limpeza Urbana",
    categoria: "Infraestrutura",
    valor: 520000,
    data: "2024-11-15",
    fornecedor: "LimpaVille Eireli",
    empenho: "EM-2024-11-067",
    status: "Pago",
  },
  {
    id: 7,
    descricao: "Aquisição de Equipamentos Hospitalares",
    categoria: "Saúde",
    valor: 890000,
    data: "2024-11-18",
    fornecedor: "MedTech Equipamentos",
    empenho: "EM-2024-11-079",
    status: "Em processamento",
  },
  {
    id: 8,
    descricao: "Reforma de Escolas Municipais",
    categoria: "Educação",
    valor: 430000,
    data: "2024-11-20",
    fornecedor: "ConstróiMais Engenharia",
    empenho: "EM-2024-11-088",
    status: "Pago",
  },
  {
    id: 9,
    descricao: "Consultoria em Gestão Pública",
    categoria: "Administração",
    valor: 78000,
    data: "2024-11-22",
    fornecedor: "GovTech Consultores",
    empenho: "EM-2024-11-094",
    status: "Em processamento",
  },
  {
    id: 10,
    descricao: "Abastecimento de Água — Manutenção",
    categoria: "Infraestrutura",
    valor: 165000,
    data: "2024-11-25",
    fornecedor: "SAAE Municipal",
    empenho: "EM-2024-11-102",
    status: "Pago",
  },
  {
    id: 11,
    descricao: "Seguro da Frota Municipal",
    categoria: "Administração",
    valor: 92000,
    data: "2024-11-28",
    fornecedor: "SeguraMais S.A.",
    empenho: "EM-2024-11-115",
    status: "Pago",
  },
  {
    id: 12,
    descricao: "Material de Escritório e TI",
    categoria: "Administração",
    valor: 45800,
    data: "2024-12-02",
    fornecedor: "PaperClip Distribuidora",
    empenho: "EM-2024-12-005",
    status: "Pendente",
  },
  {
    id: 13,
    descricao: "Serviços de Psicologia — CRAS",
    categoria: "Assistência Social",
    valor: 128000,
    data: "2024-12-05",
    fornecedor: "Cuidar Serviços",
    empenho: "EM-2024-12-012",
    status: "Pago",
  },
  {
    id: 14,
    descricao: "Equipamentos para Academia ao Ar Livre",
    categoria: "Meio Ambiente",
    valor: 68500,
    data: "2024-12-08",
    fornecedor: "FitParque Equipamentos",
    empenho: "EM-2024-12-019",
    status: "Em processamento",
  },
  {
    id: 15,
    descricao: "Publicidade e Comunicação Institucional",
    categoria: "Administração",
    valor: 34000,
    data: "2024-12-10",
    fornecedor: "CommPublic Agência",
    empenho: "EM-2024-12-025",
    status: "Pendente",
  },
]

const DEMOGRAFICOS: Demograficos = {
  populacao: 128450,
  area: 892.4,
  densidade: 143.97,
  pib_per_capita: 24800,
  idh: 0.742,
  alfabetizacao: 95.8,
  bairros: 34,
  escolas: 28,
  unidades_saude: 14,
  servidores: 3240,
}

// Simula uma API com delay de rede
export const api = {
  async getProjetos(): Promise<ApiResponse<Projeto[]>> {
    await delay(800)
    return { data: PROJETOS }
  },
  async getDespesas(): Promise<ApiResponse<Despesa[]>> {
    await delay(600)
    return { data: DESPESAS }
  },
  async getDemograficos(): Promise<ApiResponse<Demograficos>> {
    await delay(400)
    return { data: DEMOGRAFICOS }
  },
}

// Hook adaptador para usar com axios em produção
// Basta trocar as URLs abaixo pelas URLs reais
export const API_URLS = {
  projetos: "/api/projetos",
  despesas: "/api/despesas",
  demograficos: "/api/demograficos",
} as const
