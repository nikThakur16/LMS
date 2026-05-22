import React from 'react'
import { useGetStreak } from '@/hooks/streak.hook'
import { useGetAllPurchaseCourse } from '@/hooks/course.hook'
import { useGetProgress } from '@/hooks/progress.hook'
import { useUserStore } from '@/Store/user.store'
import { useNavigate } from 'react-router-dom'
import {
  Flame, Zap, BookOpen, Trophy, GraduationCap, ChevronRight, Award
} from 'lucide-react'

const ALL_BADGES = [
  { id: 'first_step',   name: 'First Step',     emoji: '🎯' },
  { id: 'five_modules', name: 'Getting Serious', emoji: '⚡' },
  { id: 'ten_modules',  name: 'On a Roll',       emoji: '🚀' },
  { id: 'on_fire',      name: 'On Fire',         emoji: '🔥' },
  { id: 'week_warrior', name: 'Week Warrior',    emoji: '⚔️' },
  { id: 'century',      name: 'Century Club',    emoji: '💯' },
  { id: 'scholar',      name: 'Scholar',         emoji: '📚' },
  { id: 'master',       name: 'Master',          emoji: '👑' },
]

const getLevel = (xp = 0) => {
  if (xp >= 1000) return { level: 5, title: 'Master',   color: 'text-amber-400',  bg: 'bg-amber-400',  next: null, floor: 1000 }
  if (xp >= 500)  return { level: 4, title: 'Expert',   color: 'text-violet-400', bg: 'bg-violet-400', next: 1000, floor: 500  }
  if (xp >= 200)  return { level: 3, title: 'Advanced', color: 'text-indigo-400', bg: 'bg-indigo-400', next: 500,  floor: 200  }
  if (xp >= 50)   return { level: 2, title: 'Learner',  color: 'text-cyan-400',   bg: 'bg-cyan-400',   next: 200,  floor: 50   }
  return           { level: 1, title: 'Beginner', color: 'text-zinc-400',   bg: 'bg-zinc-400',   next: 50,   floor: 0    }
}

const CourseProgressRow = ({ course }) => {
  const { data } = useGetProgress(course._id)
  const percent = data?.percentage || 0
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/YourCourse/${course._id}`)}
      className='flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all'
      style={{ borderColor: 'var(--app-border)' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--app-border)'}
    >
      <div className='w-12 h-12 rounded-xl overflow-hidden flex-shrink-0' style={{ background: 'var(--app-surface-2)' }}>
        <img src={course.thumbnail} alt={course.title} className='w-full h-full object-cover' />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold line-clamp-1 mb-2' style={{ color: 'var(--app-text)' }}>
          {course.title}
        </p>
        <div className='flex items-center gap-2'>
          <div className='flex-1 h-1.5 rounded-full overflow-hidden' style={{ background: 'var(--app-progress-bg)' }}>
            <div className='h-full rounded-full bg-indigo-500 transition-all duration-700'
              style={{ width: `${percent}%` }} />
          </div>
          <span className='text-xs font-semibold flex-shrink-0'
            style={{ color: percent === 100 ? '#4ade80' : '#818cf8' }}>
            {percent}%
          </span>
        </div>
      </div>
      <ChevronRight className='w-4 h-4 flex-shrink-0' style={{ color: 'var(--app-text-4)' }} />
    </div>
  )
}

const MyDashboard = () => {
  const { user } = useUserStore()
  const { data: streakData } = useGetStreak()
  const { data: coursesData } = useGetAllPurchaseCourse()
  const navigate = useNavigate()

  const xp       = streakData?.totalXP ?? 0
  const lvl      = getLevel(xp)
  const xpInLvl  = xp - lvl.floor
  const xpRange  = lvl.next ? lvl.next - lvl.floor : 1
  const pct      = lvl.next ? Math.min(100, Math.round((xpInLvl / xpRange) * 100)) : 100
  const earnedIds = new Set((streakData?.badges || []).map(b => b.id))

  const courses  = coursesData?.purchasedCourse || []
  const inProgress = courses.filter((_, i) => i < 4)

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className='min-h-screen px-6 py-10' style={{ background: 'var(--app-bg)' }}>
      <div className='max-w-5xl mx-auto space-y-6'>

        {/* Greeting header */}
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-black tracking-tight' style={{ color: 'var(--app-text)' }}>
              {greeting}, {user?.fullName?.split(' ')[0]} 👋
            </h1>
            <p className='text-sm mt-1' style={{ color: 'var(--app-text-4)' }}>
              Keep up the momentum — you're doing great!
            </p>
          </div>
          {streakData?.streak > 0 && (
            <div className='flex items-center gap-2 px-4 py-2 rounded-xl border flex-shrink-0'
              style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.2)' }}>
              <Flame className='w-5 h-5 text-orange-400' />
              <div>
                <p className='text-lg font-black text-orange-400 leading-none'>{streakData.streak}</p>
                <p className='text-xs text-orange-400/70'>day streak</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className='grid grid-cols-3 gap-4'>
          {[
            { icon: GraduationCap, label: 'Courses Enrolled', value: courses.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
            { icon: BookOpen,      label: 'Modules Done',      value: streakData?.modulesCompleted ?? 0, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { icon: Zap,           label: `Level ${lvl.level} · ${lvl.title}`, value: `${xp} XP`, color: lvl.color, bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`surface-lg p-5 border ${border}`} style={{ background: 'var(--app-surface)' }}>
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className='text-xs mt-1' style={{ color: 'var(--app-text-4)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* XP progress */}
        <div className='surface-lg p-5'>
          <div className='flex items-center justify-between text-sm mb-3'>
            <span className='font-semibold' style={{ color: 'var(--app-text)' }}>
              XP Progress — Level {lvl.level}
            </span>
            <span className={`font-bold text-xs ${lvl.color}`}>{pct}%</span>
          </div>
          <div className='h-2.5 rounded-full overflow-hidden' style={{ background: 'var(--app-progress-bg)' }}>
            <div className={`h-full rounded-full ${lvl.bg} transition-all duration-700`} style={{ width: `${pct}%` }} />
          </div>
          <p className='text-xs mt-2' style={{ color: 'var(--app-text-4)' }}>
            {lvl.next
              ? `${xpInLvl} / ${xpRange} XP to Level ${lvl.level + 1}`
              : '🎉 Max level reached — you\'re a Master!'}
          </p>
          {streakData?.atRisk && (
            <div className='flex items-center gap-2.5 mt-3 px-3.5 py-2.5 rounded-xl border'
              style={{ background: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
              <Flame className='w-4 h-4 text-orange-400 flex-shrink-0' />
              <p className='text-xs font-semibold text-orange-400'>
                Streak at risk! Complete a module today to keep your {streakData.streak}-day streak.
              </p>
            </div>
          )}
        </div>

        {/* Continue Learning */}
        {inProgress.length > 0 && (
          <div className='surface-lg p-5'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-sm font-bold' style={{ color: 'var(--app-text)' }}>Continue Learning</h2>
              <button onClick={() => navigate('/YourCourse')}
                className='text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors'>
                View all →
              </button>
            </div>
            <div className='space-y-2'>
              {inProgress.map(course => <CourseProgressRow key={course._id} course={course} />)}
            </div>
          </div>
        )}

        {courses.length === 0 && (
          <div className='surface-lg p-10 text-center'>
            <GraduationCap className='w-10 h-10 mx-auto mb-3' style={{ color: 'var(--app-text-4)' }} />
            <h2 className='font-bold mb-2' style={{ color: 'var(--app-text-2)' }}>No courses yet</h2>
            <p className='text-sm mb-5' style={{ color: 'var(--app-text-4)' }}>Start learning to track your progress here</p>
            <button onClick={() => navigate('/')} className='btn-primary px-6 py-2.5 text-sm'>
              Browse Courses
            </button>
          </div>
        )}

        {/* Badges */}
        <div className='surface-lg p-5'>
          <div className='flex items-center gap-2 mb-4'>
            <Trophy className='w-4 h-4 text-amber-400' />
            <h2 className='text-sm font-bold' style={{ color: 'var(--app-text)' }}>Badges</h2>
            <span className='text-xs ml-auto' style={{ color: 'var(--app-text-4)' }}>
              {earnedIds.size} / {ALL_BADGES.length} earned
            </span>
          </div>
          <div className='grid grid-cols-4 sm:grid-cols-8 gap-3'>
            {ALL_BADGES.map((badge) => {
              const earned = earnedIds.has(badge.id)
              return (
                <div key={badge.id} title={badge.name}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all
                    ${earned ? 'border-indigo-500/25 bg-indigo-500/08' : 'border-transparent opacity-35 grayscale'}`}
                  style={earned ? { background: 'rgba(99,102,241,0.08)' } : { background: 'var(--app-surface-2)' }}>
                  <span className='text-xl'>{badge.emoji}</span>
                  <p className='text-xs font-semibold leading-tight' style={{ color: earned ? 'var(--app-text)' : 'var(--app-text-4)' }}>
                    {badge.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyDashboard
