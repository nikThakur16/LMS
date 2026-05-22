import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BarChart3, ShoppingBag, Home, LogOut, GraduationCap } from 'lucide-react'
import { useUserStore } from '@/Store/user.store'
import { useLoggedOut } from '@/hooks/User.hook'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const DashboardSideBar = () => {
  const { user } = useUserStore()
  const { mutate, isPending } = useLoggedOut()
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard', label: 'Analytics', icon: BarChart3, end: true },
    { to: '/dashboard/dashboardProduct', label: 'Courses', icon: ShoppingBag },
  ]

  return (
    <div className='w-56 bg-zinc-950 border-r border-white/5 flex flex-col min-h-screen flex-shrink-0'>
      {/* Brand */}
      <div className='px-5 py-5 border-b border-white/5'>
        <div className='flex items-center gap-2.5'>
          <div className='w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center'>
            <GraduationCap className='w-4 h-4 text-white' />
          </div>
          <div>
            <h1 className='text-sm font-bold text-white'>EduSmart</h1>
            <p className='text-xs text-zinc-600'>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-4 space-y-0.5'>
        <p className='text-xs font-semibold text-zinc-700 uppercase tracking-widest px-3 mb-3'>Menu</p>

        <button
          onClick={() => navigate('/')}
          className='w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
            text-zinc-600 hover:bg-white/4 hover:text-white transition-all'
        >
          <Home className='w-4 h-4' />
          Back to Home
        </button>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                : 'text-zinc-500 hover:bg-white/4 hover:text-white border border-transparent'}`
            }
          >
            <item.icon className='w-4 h-4' />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className='px-3 py-3 border-t border-white/5'>
        <div className='flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900 mb-1.5'>
          <Avatar className='w-7 h-7 flex-shrink-0'>
            <AvatarImage src={user?.profilePhoto} />
            <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
              {user?.fullName?.slice(0, 2).toUpperCase() || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className='overflow-hidden'>
            <p className='text-xs font-semibold text-white truncate'>{user?.fullName || 'Admin'}</p>
            <p className='text-xs text-zinc-600 truncate'>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => mutate()}
          disabled={isPending}
          className='w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
            text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50'
        >
          <LogOut className='w-3.5 h-3.5' />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default DashboardSideBar
