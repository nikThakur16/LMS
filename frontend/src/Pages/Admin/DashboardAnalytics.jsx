import { useGetDailyData, useGetDataHook } from '@/hooks/analytic.hook'
import React, { useMemo } from 'react'
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Area, AreaChart
} from 'recharts'
import { TrendingUp, Users, BookOpen, ShoppingCart, IndianRupee, ArrowUpRight } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className='bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-3'>
      <p className='text-xs font-semibold text-zinc-400 mb-2'>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className={`text-xs font-semibold ${i === 0 ? 'text-indigo-400' : 'text-violet-400'}`}>
          {i === 0 ? `₹${p.value?.toLocaleString('en-IN')}` : `${p.value} enrollments`}
        </p>
      ))}
    </div>
  )
}

const DashboardAnalytics = () => {
  const { data } = useGetDataHook()

  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    end.setDate(end.getDate() + 1)
    const toStr = (d) => d.toISOString().split('T')[0]
    return { startDate: toStr(start), endDate: toStr(end) }
  }, [])

  const { data: dailyData, isLoading } = useGetDailyData(startDate, endDate)

  const kpis = [
    { title: 'Total Revenue',   value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, trend: '+12%', color: 'indigo' },
    { title: 'Total Users',     value: data?.users || 0,                 icon: Users,         trend: '+8%',  color: 'violet' },
    { title: 'Total Courses',   value: data?.courses || 0,               icon: BookOpen,      trend: '+3',   color: 'cyan' },
    { title: 'Enrollments',     value: data?.totalEntrollments || 0,     icon: ShoppingCart,  trend: '+18%', color: 'amber' },
  ]

  const colorMap = {
    indigo: { icon: 'bg-indigo-500/15 text-indigo-400',  trend: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    violet: { icon: 'bg-violet-500/15 text-violet-400',  trend: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    cyan:   { icon: 'bg-cyan-500/15 text-cyan-400',      trend: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    amber:  { icon: 'bg-amber-500/15 text-amber-400',    trend: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  }

  return (
    <div className='min-h-screen bg-[#09090b] p-7'>
      <div className='mb-7'>
        <h1 className='text-xl font-black text-white'>Analytics</h1>
        <p className='text-zinc-600 text-sm mt-0.5'>Platform performance overview</p>
      </div>

      {/* KPI cards */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6'>
        {kpis.map((kpi) => {
          const c = colorMap[kpi.color]
          return (
            <div key={kpi.title} className='surface-lg p-5'>
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <kpi.icon size={18} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg border ${c.trend}`}>
                  <ArrowUpRight size={11} />
                  {kpi.trend}
                </span>
              </div>
              <p className='text-2xl font-black text-white mb-0.5'>{kpi.value}</p>
              <p className='text-xs text-zinc-600 font-medium'>{kpi.title}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-5'>
        {/* Revenue chart */}
        <div className='xl:col-span-2 surface-lg p-5'>
          <div className='flex items-center justify-between mb-5'>
            <div>
              <h2 className='text-sm font-bold text-white'>Revenue Trend</h2>
              <p className='text-xs text-zinc-600 mt-0.5'>Last 7 days</p>
            </div>
            <span className='flex items-center gap-1.5 text-xs font-semibold badge-indigo'>
              <TrendingUp size={11} /> Live
            </span>
          </div>
          {isLoading ? (
            <div className='h-52 bg-zinc-800/50 rounded-xl animate-pulse' />
          ) : (
            <div className='h-52'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={dailyData || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='revenueGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#6366f1' stopOpacity={0.25} />
                      <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke='rgba(255,255,255,0.04)' strokeDasharray='3 3' />
                  <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type='monotone' dataKey='revenue' stroke='#6366f1' strokeWidth={2}
                    fill='url(#revenueGrad)' dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Enrollments chart */}
        <div className='surface-lg p-5'>
          <div className='mb-5'>
            <h2 className='text-sm font-bold text-white'>Daily Enrollments</h2>
            <p className='text-xs text-zinc-600 mt-0.5'>Last 7 days</p>
          </div>
          {isLoading ? (
            <div className='h-52 bg-zinc-800/50 rounded-xl animate-pulse' />
          ) : (
            <div className='h-52'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={dailyData || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke='rgba(255,255,255,0.04)' strokeDasharray='3 3' />
                  <XAxis dataKey='date' tick={{ fontSize: 9, fill: '#52525b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#52525b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type='monotone' dataKey='enrollments' stroke='#8b5cf6' strokeWidth={2}
                    dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Daily breakdown table */}
      {dailyData?.length > 0 && (
        <div className='mt-5 surface-lg overflow-hidden'>
          <div className='px-5 py-4 border-b border-white/5'>
            <h2 className='text-sm font-bold text-white'>Daily Breakdown</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/5'>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider'>Date</th>
                  <th className='text-right px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider'>Enrollments</th>
                  <th className='text-right px-5 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider'>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map((row, i) => (
                  <tr key={i} className='border-b border-white/3 hover:bg-white/2 transition-colors'>
                    <td className='px-5 py-3 text-sm font-medium text-zinc-300'>{row.date}</td>
                    <td className='px-5 py-3 text-right'>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg
                        ${row.enrollments > 0 ? 'bg-violet-500/15 text-violet-400' : 'text-zinc-700'}`}>
                        {row.enrollments}
                      </span>
                    </td>
                    <td className='px-5 py-3 text-right text-sm font-semibold text-indigo-400'>
                      ₹{row.revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardAnalytics
