import { useState, useEffect } from 'react'
import { blink } from '../blink/client'

interface BlinkUser {
  id: string
  email?: string
  displayName?: string
  role?: string
  [key: string]: unknown
}

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user as BlinkUser | null)
      if (!state.isLoading) setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const login = (redirectUrl?: string) => {
    blink.auth.login(redirectUrl || window.location.href)
  }

  const logout = async () => {
    await blink.auth.signOut()
    setUser(null)
  }

  return { user, isLoading, login, logout }
}
