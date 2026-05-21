import { useGetDailyData, useGetDataHook } from '@/hooks/analytic.hook'
import React, { useMemo } from 'react'
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Area, AreaChart
} from 'recharts'
import { TrendingUp, Users, BookOpen, ShoppingCart, IndianRupee, ArrowUpRight } from 'lucide-react'

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
    { title: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'emerald', trend: '+12%' },
    { title: 'Total Users', value: data?.users || 0, icon: Users, color: 'blue', trend: '+8%' },
    { title: 'Total Courses', value: data?.courses || 0, icon: BookOpen, color: 'violet', trend: '+3' },
    { title: 'Enrollments', value: data?.totalEntrollments || 0, icon: ShoppingCart, color: 'amber', trend: '+18%' },
  ]

  const colorMap = {
    emerald: { icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-100', trend: 'text-emerald-600 bg-emerald-50' },
    blue: { icon: 'bg-blue-100 text-blue-600', border: 'border-blue-100', trend: 'text-blue-600 bg-blue-50' },
    violet: { icon: 'bg-violet-100 text-violet-600', border: 'border-violet-100', trend: 'text-violet-600 bg-violet-50' },
    amber: { icon: 'bg-amber-100 text-amber-600', border: 'border-amber-100', trend: 'text-amber-600 bg-amber-50' },
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className='bg-white border border-slate-200 rounded-xl shadow-xl p-4'>
        <p className='text-sm font-bold text-slate-700 mb-2'>{label}</p>
        {payload.map((p, i) => (
          <p key={i} className={`text-sm font-semibold ${i === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {i === 0 ? `₹${p.value?.toLocaleString('en-IN')}` : `${p.value} enrollments`}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50 p-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-black text-slate-900'>Analytics Overview</h1>
        <p className='text-slate-500 mt-1'>Platform performance at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>
        {kpis.map((kpi) => {
          const c = colorMap[kpi.color]
          return (
            <div key={kpi.title} className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <kpi.icon size={20} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${c.trend}`}>
                  <ArrowUpRight size={12} />
                  {kpi.trend}
                </span>
              </div>
              <p className='text-2xl font-black text-slate-900 mb-1'>{kpi.value}</p>
              <p className='text-sm text-slate-500 font-medium'>{kpi.title}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-base font-bold text-slate-900'>Revenue Trend</h2>
              <p className='text-sm text-slate-500 mt-0.5'>Last 7 days</p>
            </div>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full'>
              <TrendingUp size={13} />
              Live data
            </div>
          </div>
          {isLoading ? (
            <div className='h-64 bg-slate-50 rounded-xl animate-pulse' />
          ) : (
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={dailyData || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='revenueGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#10b981' stopOpacity={0.2} />
                      <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke='#f1f5f9' strokeDasharray='3 3' />
                  <XAxis dataKey='date' tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type='monotone' dataKey='revenue' stroke='#10b981' strokeWidth={2.5}
                    fill='url(#revenueGrad)' dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
          <div className='mb-6'>
            <h2 className='text-base font-bold text-slate-900'>Daily Enrollments</h2>
            <p className='text-sm text-slate-500 mt-0.5'>Last 7 days</p>
          </div>
          {isLoading ? (
            <div className='h-64 bg-slate-50 rounded-xl animate-pulse' />
          ) : (
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={dailyData || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke='#f1f5f9' strokeDasharray='3 3' />
                  <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type='monotone' dataKey='enrollments' stroke='#3b82f6' strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Daily breakdown table */}
      {dailyData && dailyData.length > 0 && (
        <div className='mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-slate-100'>
            <h2 className='text-base font-bold text-slate-900'>Daily Breakdown</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-slate-50'>
                  <th className='text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider'>Date</th>
                  <th className='text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider'>Enrollments</th>
                  <th className='text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider'>Revenue</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {dailyData.map((row, i) => (
                  <tr key={i} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-3 font-medium text-slate-800'>{row.date}</td>
                    <td className='px-6 py-3 text-right'>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.enrollments > 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}>
                        {row.enrollments}
                      </span>
                    </td>
                    <td className='px-6 py-3 text-right font-semibold text-emerald-600'>
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
