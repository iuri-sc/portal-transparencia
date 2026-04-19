import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

interface NavItem {
  to: string
  label: string
  exact?: boolean
}

const navItems: NavItem[] = [
  { to: "/", label: "Início", exact: true },
  { to: "/dados", label: "Projetos" },
  { to: "/despesas", label: "Despesas" },
  { to: "/configuracoes", label: "Configurações" },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center border-b border-white/10 bg-green-700 px-4 sm:px-6 dark:bg-gray-950">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* logo */}
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-400 text-lg text-green-700">
            T
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm leading-none text-amber-400">
              Portal de Transparência
            </p>
            <p className="mt-0.5 font-mono text-[10px] tracking-widest text-white/40 uppercase">
              Vila Verde - 2024
            </p>
          </div>
        </NavLink>
        {/* links desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-1.5 text-sm transition-all ${
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors hover:bg-white/10"
          >
            {theme === "light" ? "Escuro" : "Claro"}
          </button>
        </div>
        {/* mobile hamburguer */}
        <button
          className="flex flex-col gap-1.5 p-1 sm:hidden"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          <span className="h-0.5 w-5 rounded bg-white/70 transition-all" />
          <span className="h-0.5 w-5 rounded bg-white/70 transition-all" />
          <span className="h-0.5 w-5 rounded bg-white/70 transition-all" />
        </button>
      </div>
      {/* mobile menu */}
      {open && (
        <div className="absolute top-16 right-0 left-0 z-50 flex flex-col gap-1 border-b border-white/10 bg-green-700 px-4 py-3 sm:hidden dark:bg-gray-950">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white/15 font-medium text-white" : "text-white/60"}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 text-left font-mono text-xs text-white/60"
          >
            {theme === "light" ? "Escuro" : "Claro"}
          </button>
        </div>
      )}
    </nav>
  )
}
