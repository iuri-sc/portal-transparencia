import { useState, useEffect, useCallback } from "react"
import axios, { type AxiosRequestConfig, isAxiosError } from "axios"

interface UseFetchReturn<T> {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => void
}

export function useFetch<T>(url: string, options: AxiosRequestConfig = {}): UseFetchReturn<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get<T>(url, {
                timeout: 1000000,
                ...options,
            })
            setData(response.data)
        } catch (err) {
            if (axios.isCancel(err)) return

            if (isAxiosError(err)) {
                if (err.code === "ECONNABORTED") {
                    setError("A requisição expirou. Tente novamente")
                } else if (err.response) {
                    setError(`Erro ${err.response.status}: ${err.response.statusText}`)
                } else if (err.request) {
                    setError("Sem conexão com o servidor. Verifique sua internet")
                } else {
                    setError("Erro inesperado. Tente novamente")
                }
            } else {
                setError("Erro inesperado. Tente novamente")
            }
        } finally {
            setLoading(false)
        }
    }, [url])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
