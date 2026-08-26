import { createContext, useContext, useState, useEffect } from 'react'

const AdminThemeContext = createContext()

export function AdminThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode')
    return saved === 'true' || false
  })

  useEffect(() => {
    localStorage.setItem('adminDarkMode', isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(prev => !prev)

  return (
    <AdminThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}
