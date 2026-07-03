import { useEffect } from 'react'
  import { useLocation } from 'react-router-dom'
  import { supabase } from '../lib/supabase'

  export function usePageView() {
    const location = useLocation()
    useEffect(() => {
      supabase.from('page_views').insert({
        path: location.pathname,
        referrer: document.referrer || null,
      }).then(() => {})
    }, [location.pathname])
  }
  