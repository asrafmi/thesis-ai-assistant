// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useCallback, useRef } from 'react'
import { exportThesisDocxAction } from '@/actions/export.actions'

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inFlightRef = useRef(false)

  const exportDocx = useCallback(async (filename: string) => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    setIsExporting(true)
    setError(null)

    const result = await exportThesisDocxAction()

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      const byteChars = atob(result.data)
      const byteArray = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i)
      }
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.docx`
      a.click()
      URL.revokeObjectURL(url)
    }

    setIsExporting(false)
    inFlightRef.current = false
  }, [])

  return { exportDocx, isExporting, error }
}
