import { useState, useEffect } from 'react'
import Portfolio from './Portfolio'
import Admin from './Admin'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.startsWith('#/admin'))
  useEffect(() => {
    const h = () => setIsAdmin(window.location.hash.startsWith('#/admin'))
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])
  return isAdmin ? <Admin /> : <Portfolio />
}
