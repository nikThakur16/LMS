import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLoggedOut } from '@/hooks/User.hook'
import { useGetStreak } from '@/hooks/streak.hook'
import { Spinner } from './ui/spinner'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useUserStore } from '@/Store/user.store'
import { useThemeStore } from '@/Store/theme.store'
import {
  LogOut, User, LayoutDashboard, BookOpen, GraduationCap,
  ChevronDown, Flame, Sun, Moon, Heart
} from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate, isPending } = useLoggedOut()
  const { user } = useUserStore()
  const { data: streakData } = useGetStreak()
  const { theme, toggleTheme } = useThemeStore()

  const navLinks = [
    { label: 'Browse', href: '/' },
    { label: 'My Learning', href: '/my-dashboard' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ]

  const menuItems = [
    ...(user?.admin ? [{
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => navigate('/dashboard')
    }] : []),
    { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
    { label: 'My Courses', icon: BookOpen, onClick: () => navigate('/YourCourse') },
    ...(!user?.admin ? [{ label: 'Wishlist', icon: Heart, onClick: () => navigate('/wishlist') }] : []),
    { label: 'Logout', icon: LogOut, onClick: () => mutate(), loading: isPending },
  ]

  const isActive = (href) => location.pathname === href

  const isDark = theme === 'dark'

  return (
    <nav className='h-14 w-full flex items-center justify-between px-6 lg:px-10
      sticky top-0 z-50 border-b transition-colors duration-200'
      style={{
        background: isDark ? 'rgba(9,9,11,0.9)' : 'rgba(248,250,252,0.9)',
        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >

      {/* Left: Brand */}
      <Link to='/' className='flex items-center gap-2 flex-shrink-0'>
        <div className='w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center'>
          <GraduationCap className='w-4 h-4 text-white' />
        </div>
        <span className='text-[15px] font-bold tracking-tight' style={{ color: 'var(--app-text)' }}>EduSmart</span>
      </Link>

      {/* Center: Nav links */}
      <div className='hidden md:flex items-center gap-1'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className='px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150'
            style={{
              color: isActive(link.href) ? 'var(--app-text)' : 'var(--app-text-3)',
              background: isActive(link.href) ? 'var(--app-hover)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive(link.href)) {
                e.currentTarget.style.color = 'var(--app-text)'
                e.currentTarget.style.background = 'var(--app-hover)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(link.href)) {
                e.currentTarget.style.color = 'var(--app-text-3)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right: Actions row */}
      <div className='flex items-center gap-2'>
        {/* Streak chip — students only */}
        {!user?.admin && (
          <button
            onClick={() => navigate('/profile')}
            className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold
              border transition-all duration-150'
            style={streakData?.streak > 0 ? {
              background: 'rgba(249,115,22,0.1)',
              borderColor: 'rgba(249,115,22,0.25)',
              color: '#f97316',
            } : {
              background: 'var(--app-surface-2)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text-4)',
            }}
          >
            <Flame className='w-3.5 h-3.5' style={{ color: streakData?.streak > 0 ? '#f97316' : 'var(--app-text-4)' }} />
            {streakData?.streak ?? 0}
            <span className='text-xs font-medium opacity-70'>day{streakData?.streak !== 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className='w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-150'
          style={{
            background: 'var(--app-surface)',
            borderColor: 'var(--app-border)',
            color: 'var(--app-text-3)',
          }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun className='w-4 h-4 text-amber-400' />
            : <Moon className='w-4 h-4 text-indigo-500' />
          }
        </button>

        {/* Avatar menu */}
        <Popover>
          <PopoverTrigger asChild>
            <button className='flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-150 group'
              style={{ color: 'var(--app-text)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar className='w-8 h-8 ring-1' style={{ '--tw-ring-color': 'var(--app-border)' }}>
                <AvatarImage src={user?.profilePhoto} className='object-cover' />
                <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                  {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'ES'}
                </AvatarFallback>
              </Avatar>
              <div className='hidden md:block text-left'>
                <p className='text-sm font-semibold leading-none' style={{ color: 'var(--app-text)' }}>
                  {user?.fullName?.split(' ')[0] || 'User'}
                </p>
              </div>
              <ChevronDown className='w-3.5 h-3.5 transition-colors' style={{ color: 'var(--app-text-4)' }} />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className='w-56 p-1.5 mt-1 shadow-2xl rounded-2xl border'
            style={{
              background: 'var(--app-surface)',
              borderColor: 'var(--app-border)',
              boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.6)' : '0 25px 50px rgba(0,0,0,0.15)',
            }}
            align='end'
          >
            <div className='px-3 py-2.5 mb-1 border-b' style={{ borderBottomColor: 'var(--app-border)' }}>
              <p className='text-sm font-semibold truncate' style={{ color: 'var(--app-text)' }}>{user?.fullName || 'Welcome'}</p>
              <p className='text-xs mt-0.5' style={{ color: 'var(--app-text-4)' }}>{user?.admin ? 'Administrator' : 'Student'}</p>
            </div>

            <div className='space-y-0.5 py-1'>
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  disabled={item.loading}
                  className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed font-medium relative'
                  style={{ color: 'var(--app-text-2)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--app-hover)'
                    e.currentTarget.style.color = 'var(--app-text)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--app-text-2)'
                  }}
                >
                  <item.icon className='w-4 h-4 flex-shrink-0' style={{ color: 'var(--app-text-4)' }} />
                  <span>{item.label}</span>
                  {item.loading && <Spinner size='sm' className='absolute right-3' />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  )
}

export default Navbar
