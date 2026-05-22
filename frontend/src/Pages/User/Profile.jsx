import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/Store/user.store'
import { useUpdateProfileHook } from '@/hooks/User.hook'
import { useGetStreak } from '@/hooks/streak.hook'
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { Camera, User, Mail, ShieldCheck, Flame, Zap, Trophy } from 'lucide-react'

// XP level thresholds
const getLevel = (xp = 0) => {
  if (xp >= 1000) return { level: 5, title: 'Master',    color: 'text-amber-400',  bg: 'bg-amber-400',  next: null,  floor: 1000 }
  if (xp >= 500)  return { level: 4, title: 'Expert',    color: 'text-violet-400', bg: 'bg-violet-400', next: 1000, floor: 500  }
  if (xp >= 200)  return { level: 3, title: 'Advanced',  color: 'text-indigo-400', bg: 'bg-indigo-400', next: 500,  floor: 200  }
  if (xp >= 50)   return { level: 2, title: 'Learner',   color: 'text-cyan-400',   bg: 'bg-cyan-400',   next: 200,  floor: 50   }
  return           { level: 1, title: 'Beginner',  color: 'text-zinc-400',   bg: 'bg-zinc-400',   next: 50,   floor: 0    }
}

const ALL_BADGES = [
  { id: 'first_step',   name: 'First Step',     desc: 'Complete your first module',      emoji: '🎯' },
  { id: 'five_modules', name: 'Getting Serious', desc: 'Complete 5 modules',              emoji: '⚡' },
  { id: 'ten_modules',  name: 'On a Roll',       desc: 'Complete 10 modules',             emoji: '🚀' },
  { id: 'on_fire',      name: 'On Fire',         desc: 'Achieve a 3-day streak',          emoji: '🔥' },
  { id: 'week_warrior', name: 'Week Warrior',    desc: 'Achieve a 7-day streak',          emoji: '⚔️' },
  { id: 'century',      name: 'Century Club',    desc: 'Earn 100 XP',                     emoji: '💯' },
  { id: 'scholar',      name: 'Scholar',         desc: 'Earn 500 XP',                     emoji: '📚' },
  { id: 'master',       name: 'Master',          desc: 'Earn 1000 XP',                    emoji: '👑' },
]

const Profile = () => {
  const { user, setUser } = useUserStore()
  const { mutate, isPending } = useUpdateProfileHook()
  const { data: streakData } = useGetStreak()
  const { register, handleSubmit, reset } = useForm()
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName })
      setPreview(user.profilePhoto || null)
    }
  }, [user, reset])

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    if (data.profilePhoto?.[0]) formData.append('profilePhoto', data.profilePhoto[0])
    mutate(formData, { onSuccess: (res) => { if (res.user) setUser(res.user) } })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const xp      = streakData?.totalXP ?? 0
  const lvl     = getLevel(xp)
  const xpInLvl = xp - lvl.floor
  const xpRange = lvl.next ? lvl.next - lvl.floor : 1
  const pct     = lvl.next ? Math.min(100, Math.round((xpInLvl / xpRange) * 100)) : 100

  const earnedIds = new Set((streakData?.badges || []).map((b) => b.id))

  return (
    <div className='min-h-screen bg-[#09090b] px-6 py-12'>
      <div className='max-w-2xl mx-auto space-y-5'>
        <h1 className='text-2xl font-black text-white tracking-tight'>Profile</h1>

        {/* ── Gamification stats ── */}
        {!user?.admin && (
          <div className='surface-lg p-5 space-y-5'>
            {/* XP + Level row */}
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center'>
                  <Zap className='w-5 h-5 text-indigo-400' />
                </div>
                <div>
                  <p className='text-xs text-zinc-600 font-medium uppercase tracking-wider'>Level {lvl.level}</p>
                  <p className={`text-sm font-bold ${lvl.color}`}>{lvl.title}</p>
                </div>
              </div>

              <div className='flex items-center gap-4 text-center'>
                <div>
                  <p className='text-lg font-black text-white'>{xp}</p>
                  <p className='text-xs text-zinc-600'>Total XP</p>
                </div>
                <div className='w-px h-8 bg-white/5' />
                <div>
                  <div className={`flex items-center justify-center gap-1 text-lg font-black ${streakData?.streak > 0 ? 'text-orange-400' : 'text-zinc-600'}`}>
                    <Flame className='w-4 h-4' />
                    {streakData?.streak ?? 0}
                  </div>
                  <p className='text-xs text-zinc-600'>Day streak</p>
                </div>
                <div className='w-px h-8 bg-white/5' />
                <div>
                  <p className='text-lg font-black text-white'>{streakData?.modulesCompleted ?? 0}</p>
                  <p className='text-xs text-zinc-600'>Modules done</p>
                </div>
              </div>
            </div>

            {/* XP progress bar */}
            <div>
              <div className='flex justify-between text-xs text-zinc-600 mb-1.5'>
                <span>{lvl.next ? `${xpInLvl} / ${xpRange} XP to Level ${lvl.level + 1}` : 'Max level reached'}</span>
                <span className={lvl.color}>{pct}%</span>
              </div>
              <div className='h-2 bg-zinc-800 rounded-full overflow-hidden'>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${lvl.bg}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Streak at-risk warning */}
            {streakData?.atRisk && (
              <div className='flex items-center gap-2.5 px-3.5 py-2.5 bg-orange-500/8 border border-orange-500/20 rounded-xl'>
                <Flame className='w-4 h-4 text-orange-400 flex-shrink-0' />
                <p className='text-xs font-semibold text-orange-400'>
                  Your streak is at risk! Complete a module today to keep your {streakData.streak}-day streak.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Badges ── */}
        {!user?.admin && (
          <div className='surface-lg p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <Trophy className='w-4 h-4 text-amber-400' />
              <h2 className='text-sm font-bold text-white'>Badges</h2>
              <span className='text-xs text-zinc-600 ml-auto'>{earnedIds.size} / {ALL_BADGES.length} earned</span>
            </div>
            <div className='grid grid-cols-4 gap-3'>
              {ALL_BADGES.map((badge) => {
                const earned = earnedIds.has(badge.id)
                const earnedAt = streakData?.badges?.find((b) => b.id === badge.id)?.earnedAt
                return (
                  <div
                    key={badge.id}
                    title={badge.desc}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all
                      ${earned
                        ? 'bg-indigo-500/10 border-indigo-500/25'
                        : 'bg-zinc-900/50 border-white/5 opacity-40 grayscale'}`}
                  >
                    <span className='text-2xl'>{badge.emoji}</span>
                    <p className={`text-xs font-semibold leading-tight ${earned ? 'text-white' : 'text-zinc-600'}`}>
                      {badge.name}
                    </p>
                    {earned && earnedAt && (
                      <p className='text-xs text-zinc-600'>
                        {new Date(earnedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                    {!earned && (
                      <p className='text-xs text-zinc-700 leading-tight'>{badge.desc}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Profile settings card ── */}
        <div className='surface-lg p-8'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-7'>
            {/* Avatar */}
            <div className='flex flex-col items-center gap-3'>
              <div className='relative'>
                <div className='w-24 h-24 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-white/8'>
                  {preview ? (
                    <img src={preview} alt='Profile' className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <User className='w-10 h-10 text-zinc-600' />
                    </div>
                  )}
                </div>
                <label className='absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 hover:bg-indigo-400
                  rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg'>
                  <Camera className='w-3.5 h-3.5 text-white' />
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    {...register('profilePhoto')}
                    onChange={(e) => {
                      register('profilePhoto').onChange(e)
                      handlePhotoChange(e)
                    }}
                  />
                </label>
              </div>
              <p className='text-xs text-zinc-600'>Click camera to change photo</p>
            </div>

            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Full Name</label>
              <div className='relative'>
                <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600' />
                <input
                  {...register('fullName', { required: true })}
                  placeholder='Your full name'
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm'
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700' />
                <input
                  value={user?.email || ''}
                  disabled
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm opacity-40 cursor-not-allowed'
                />
              </div>
              <p className='text-xs text-zinc-700 mt-1'>Email cannot be changed</p>
            </div>

            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Account Type</label>
              <div className='flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 border border-white/8 rounded-xl'>
                <ShieldCheck className='w-4 h-4 text-zinc-600' />
                <span className={`text-sm font-semibold ${user?.admin ? 'text-amber-400' : 'text-indigo-400'}`}>
                  {user?.admin ? 'Administrator' : 'Student'}
                </span>
              </div>
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2'
            >
              {isPending ? <><Spinner /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
