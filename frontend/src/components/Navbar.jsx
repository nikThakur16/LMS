import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLoggedOut } from '@/hooks/User.hook'
import { Spinner } from './ui/spinner'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useUserStore } from '@/Store/user.store'
import { LogOut, User, LayoutDashboard, BookOpen, GraduationCap, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate, isPending } = useLoggedOut()
  const { user } = useUserStore()

  const navLinks = [
    { label: 'Browse', href: '/' },
    { label: 'My Learning', href: '/YourCourse' },
  ]

  const menuItems = [
    ...(user?.admin ? [{
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => navigate('/dashboard')
    }] : []),
    { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
    { label: 'My Courses', icon: BookOpen, onClick: () => navigate('/YourCourse') },
    { label: 'Logout', icon: LogOut, onClick: () => mutate(), loading: isPending },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <nav className='h-14 w-full flex items-center justify-between px-6 lg:px-10
      bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>

      {/* Left: Brand */}
      <Link to='/' className='flex items-center gap-2 flex-shrink-0'>
        <div className='w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center'>
          <GraduationCap className='w-4 h-4 text-white' />
        </div>
        <span className='text-[15px] font-bold text-white tracking-tight'>EduSmart</span>
      </Link>

      {/* Center: Nav links */}
      <div className='hidden md:flex items-center gap-1'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive(link.href)
                ? 'text-white bg-white/8'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right: Avatar menu */}
      <Popover>
        <PopoverTrigger asChild>
          <button className='flex items-center gap-2 px-2 py-1.5 rounded-xl
            hover:bg-white/5 transition-all duration-150 group'>
            <Avatar className='w-8 h-8 ring-1 ring-white/10'>
              <AvatarImage src={user?.profilePhoto} className='object-cover' />
              <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'ES'}
              </AvatarFallback>
            </Avatar>
            <div className='hidden md:block text-left'>
              <p className='text-sm font-semibold text-white leading-none'>
                {user?.fullName?.split(' ')[0] || 'User'}
              </p>
            </div>
            <ChevronDown className='w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors' />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className='w-56 p-1.5 mt-1 bg-zinc-900 border border-white/8 shadow-2xl shadow-black/50 rounded-2xl'
          align='end'
        >
          <div className='px-3 py-2.5 mb-1 border-b border-white/5'>
            <p className='text-sm font-semibold text-white truncate'>{user?.fullName || 'Welcome'}</p>
            <p className='text-xs text-zinc-500 mt-0.5'>{user?.admin ? 'Administrator' : 'Student'}</p>
          </div>

          <div className='space-y-0.5 py-1'>
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                disabled={item.loading}
                className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                  text-zinc-300 hover:text-white hover:bg-white/5
                  transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
                  font-medium relative'
              >
                <item.icon className='w-4 h-4 text-zinc-500 flex-shrink-0' />
                <span>{item.label}</span>
                {item.loading && <Spinner size='sm' className='absolute right-3' />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  )
}

export default Navbar
