import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'

type AuthStore = {
  authenticated: boolean
  username: string
  role: string
  department: string
  setAuthenticated: (value: boolean) => void
  setUsername: (value: string) => void
  setRole: (value: string) => void
  setDepartment: (value: string) => void
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      authenticated: false,
      username: '',
      role: '',
      department: '',
      setAuthenticated: (value: boolean) => set({ authenticated: value }),
      setUsername: (value: string) => set({ username: value }),
      setRole: (value: string) => set({ role: value }),
      setDepartment: (value: string) => set({ department: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = Cookies.get(name)
          if (!str) return null
          try {
            return JSON.parse(str)
          } catch {
            return str
          }
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value), { expires: 365, path: '/' })
        },
        removeItem: (name) => Cookies.remove(name),
      })),
    }
  )
)

// Export a function to get the store's state
export const getAuthState = () => useAuthStore.getState()

export default useAuthStore

