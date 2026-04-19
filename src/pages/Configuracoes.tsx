import { useState, type ReactNode } from "react"
import { useTheme, type FontSize, type Theme } from "../context/ThemeContext"

interface SectionProps {
    title: string
    children: ReactNode
}

function Section({ title, children }: SectionProps) {
    return (
        <div className="card mb-4 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3.5 dark:border-gray-800 dark:bg-gray-800/50">
                <h2 className="font-display text-xl font-normal text-gray-900 dark:text-gray-50">
                    {title}
                </h2>
            </div>
            <div className="divide-y divide-gray-100 px-6 py-4 dark:divide-gray-100">
                {children}
            </div>
        </div>
    )
}

interface ToggleProps {
    label: string
    description?: string
    checked: boolean
    onChange: (value: boolean) => void
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
            </div>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className="relative h-6 w-11 shrink-0 rounded-full border-none transition-colors duration-200"
                style={{ backgroundColor: checked ? "#1d9e75" : "#d1d5db" }}
            >
                <span
                    className="absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all duration-200"
                    style={{ left: checked ? "23px" : "3px" }}
                />
            </button>
        </div>
    )
}

interface Option<T extends string> {
    value: T
    label: string
}

interface OptionGroupProps<T extends string> {
    label: string
    description?: string
    options: Option<T>[]
    value: T
    onChange: (value: T) => void
}

function OptionGroup<T extends string>({
    label,
    description,
    options,
    value,
    onChange,
}: OptionGroupProps<T>) {
    return (
        <div className="py-3.5">
            <p className="mb-0.5 text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
            {description && <p className="mb-3 text-xs text-gray-400">{description}</p>}
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`rounded-lg border px-4 py-1.5 text-sm transition-all ${
                            value === opt.value
                                ? "border-green-500 bg-green-50 font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function Configuracoes() {
    const { theme, setTheme, fontSize, setFontSize, compactMode, setCompactMode } = useTheme()
    const [notif, setNotif] = useState(true)
    const [saved, setSaved] = useState(false)

    const salvar = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <main className="animate-in mx-auto max-w-2xl px-4 py-8 sm:px-6">
            <div className="mb-7">
                <p className="section-label mb-1.5">Preferências</p>
                <h1
                    className="font-display font-normal text-gray-900 dark:text-gray-50"
                    style={{ fontSize: "clamp(24px,3vw,38px)" }}
                >
                    Configurações
                </h1>
                <p className="mt-1.5 text-sm text-gray-400">
                    Personalize a exibição e o comportamento do portal
                </p>
                <div className="divider" />
            </div>
            <Section title="Aparência">
                <OptionGroup<Theme>
                    label="Tema da interface"
                    description="Escolha entre tema claro ou escuro"
                    options={[
                        { value: "light", label: "Claro" },
                        { value: "dark", label: "Escuro" },
                    ]}
                    value={theme}
                    onChange={setTheme}
                />
                <OptionGroup<FontSize>
                    label="Tamanho da fonte"
                    options={[
                        { value: "small", label: "Pequeno" },
                        { value: "medium", label: "Médio" },
                        { value: "large", label: "Grande" },
                    ]}
                    value={fontSize}
                    onChange={setFontSize}
                />
                <Toggle
                    label="Modo compacto"
                    description="Reduz o espaçamento para exibir mais conteúdo"
                    checked={compactMode}
                    onChange={setCompactMode}
                />
            </Section>
            <Section title="Notificações">
                <Toggle
                    label="Notificações de atualização"
                    description="Alerta quando novos dados forem publicados"
                    checked={notif}
                    onChange={setNotif}
                />
                <Toggle
                    label="Relatórios mensais"
                    description="Resumo mensal de despesas e projetos"
                    checked={false}
                    onChange={() => {}}
                />
            </Section>
            <Section title="Acessibilidade">
                <Toggle
                    label="Alto contraste"
                    description="Aumenta o contraste para melhor legibilidade"
                    checked={false}
                    onChange={() => {}}
                />
                <Toggle
                    label="Reduzir animações"
                    description="Desativa transições na interface"
                    checked={false}
                    onChange={() => {}}
                />
            </Section>
            <Section title="Dados e privacidade">
                <div className="py-3.5">
                    <p className="mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                        Cache de dados
                    </p>
                    <p className="mb-3 text-xs text-gray-400">
                        Os dados buscados ficam armazenados localmente para melhorar o desempenho
                    </p>
                    <button
                        onClick={() => {
                            localStorage.removeItem("portal-favoritos")
                            window.location.reload()
                        }}
                        className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-500 transition-colors hover:border-red-300 hover:text-red-500 dark:border-gray-700"
                    >
                        Limpar dados locais
                    </button>
                </div>
                <div className="py-3.5">
                    <p className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                        Sobre os dados
                    </p>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Todos os dados são de domínio público, divulgados em comformidade com a Lei
                        de Acesso à Informação (Lei n 12.527/2011). Atualizados mensalmente
                    </p>
                </div>
            </Section>
            <div className="mt-2 flex justify-end">
                <button
                    onClick={salvar}
                    className={`rounded-xl px-7 py-2.5 text-sm font-medium text-white transition-colors ${
                        saved ? "bg-green-500" : "bg-green-700 hover:bg-green-700/90"
                    }`}
                >
                    {saved ? "Preferências salvas" : "Salvar preferências"}
                </button>
            </div>
            <p className="section-label mt-10 text-center">Portal de Transparência Municipal</p>
        </main>
    )
}
