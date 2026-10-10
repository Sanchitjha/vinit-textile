import { createContext, useContext, useState, useEffect } from 'react'

const AdminThemeContext = createContext()

export function AdminThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode')
    // Default to true (Atlas Dark theme as shown in screenshot)
    return saved !== null ? saved === 'true' : true
  })

  useEffect(() => {
    localStorage.setItem('adminDarkMode', isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    return () => {
      // Clean up when leaving admin routes
      document.documentElement.classList.remove('dark')
    }
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
