import { useCallback, useEffect, useState } from 'react'
import api from '@/services/api'

/**
 * Loads the document list with loading / error / empty states and exposes a
 * reload plus a setter for optimistic updates.
 */
export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await api.getDocuments()
      setDocuments(docs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { documents, setDocuments, loading, error, reload }
}

/** Loads a single document by id. */
export function useDocument(id) {
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const doc = await api.getDocument(id)
      setDocument(doc)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    reload()
  }, [reload])

  return { document, setDocument, loading, error, reload }
}
