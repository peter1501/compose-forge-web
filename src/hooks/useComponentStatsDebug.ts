import { useState, useEffect } from 'react'

export function useComponentStatsDebug(componentId: string) {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Fetch stats directly from API
        const statsRes = await fetch(`/api/components/${componentId}/stats`)
        const stats = await statsRes.json()
        
        // Fetch from Supabase directly
        const supabaseRes = await fetch('/api/debug/component-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ componentId })
        })
        const supabaseData = await supabaseRes.json()
        
        setDebugInfo({
          apiStats: stats,
          supabaseData: supabaseData,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Debug fetch error:', error)
      }
    }

    fetchDebugInfo()
  }, [componentId])

  return debugInfo
}