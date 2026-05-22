import React, { useEffect } from 'react'
import MainRoutes from './Routes/MainRoutes'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'
import { useThemeStore } from './Store/theme.store'

const App = () => {
  const location = useLocation()
  const { theme } = useThemeStore()
  const hiddenRoute = ['/login', '/register', '/dashboard']
  const shouldHideNavbar = hiddenRoute.some((route) => location.pathname.startsWith(route))

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <MainRoutes />
    </div>
  )
}

export default App
