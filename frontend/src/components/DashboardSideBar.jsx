import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Home, BarChart3, LogOut, BookOpen } from 'lucide-react'
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
    <div className='w-64 bg-slate-900 flex flex-col min-h-screen'>
      {/* Brand */}
      <div className='p-6 border-b border-slate-800'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center'>
            <BookOpen className='w-5 h-5 text-emerald-400' />
          </div>
          <div>
            <h1 className='text-base font-black text-white tracking-tight'>EduSmart</h1>
            <p className='text-xs text-slate-500 font-medium'>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 p-4 space-y-1'>
        <p className='text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-3'>Menu</p>

        <button
          onClick={() => navigate('/')}
          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-slate-400 hover:bg-slate-800 hover:text-white transition-all'
        >
          <Home className='w-4.5 h-4.5' size={18} />
          <span>Back to Home</span>
        </button>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className='p-4 border-t border-slate-800'>
        <div className='flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/60 mb-2'>
          <Avatar className='w-8 h-8 flex-shrink-0'>
            <AvatarImage src={user?.profilePhoto} />
            <AvatarFallback className='bg-emerald-600 text-white text-xs font-bold'>
              {user?.fullName?.slice(0, 2).toUpperCase() || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className='overflow-hidden'>
            <p className='text-sm font-semibold text-white truncate'>{user?.fullName || 'Admin'}</p>
            <p className='text-xs text-slate-500 truncate'>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => mutate()}
          disabled={isPending}
          className='w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
            text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50'
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default DashboardSideBar
