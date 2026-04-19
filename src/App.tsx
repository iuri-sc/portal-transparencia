import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { DataProvider } from "./context/DataContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Dados from "./pages/Dados"
import Despesas from "./pages/Despesas"
import Configuracoes from "./pages/Configuracoes"

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-6xl text-gray-200 dark:text-gray-800">404</p>
      <h1 className="font-display mt-3 mb-2 text-3xl font-normal text-gray-800 dark:text-gray-200">
        Página não encontrada
      </h1>
      <p className="text-sm text-gray-400">A rota solicitada não existe</p>
      <a href="/" className="btn-primary mt-6 inline-block">
        Voltar ao início
      </a>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <Navbar />
          <div className="min-h-[calc(100vh=64px)] bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dados" element={<Dados />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  )
}
