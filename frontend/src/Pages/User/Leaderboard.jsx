import React from 'react'
import { useGetLeaderboard } from '@/hooks/streak.hook'
import { useUserStore } from '@/Store/user.store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Flame, Zap, BookOpen, Award, Trophy } from 'lucide-react'

const MEDALS = ['🥇', '🥈', '🥉']

const getLevel = (xp = 0) => {
  if (xp >= 1000) return { title: 'Master',    color: 'text-amber-400'  }
  if (xp >= 500)  return { title: 'Expert',    color: 'text-violet-400' }
  if (xp >= 200)  return { title: 'Advanced',  color: 'text-indigo-400' }
  if (xp >= 50)   return { title: 'Learner',   color: 'text-cyan-400'   }
  return           { title: 'Beginner',  color: 'text-zinc-400'   }
}

const Leaderboard = () => {
  const { data, isLoading } = useGetLeaderboard()
  const { user } = useUserStore()

  const list = data?.leaderboard || []
  const currentUserEntry = data?.currentUserEntry

  return (
    <div className='min-h-screen px-6 py-10' style={{ background: 'var(--app-bg)' }}>
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 bg-amber-500/15 border border-amber-500/25 rounded-xl
            flex items-center justify-center'>
            <Trophy className='w-5 h-5 text-amber-400' />
          </div>
          <div>
            <h1 className='text-2xl font-black tracking-tight' style={{ color: 'var(--app-text)' }}>
              Leaderboard
            </h1>
            <p className='text-sm' style={{ color: 'var(--app-text-4)' }}>Top learners by XP earned</p>
          </div>
        </div>

        {/* Top 3 podium */}
        {!isLoading && list.length >= 3 && (
          <div className='flex items-end justify-center gap-3 my-8'>
            {[list[1], list[0], list[2]].map((entry, podiumIdx) => {
              const heights = ['h-24', 'h-32', 'h-20']
              const medals = ['🥈', '🥇', '🥉']
              const ranks = [2, 1, 3]
              const lvl = getLevel(entry.totalXP)
              return (
                <div key={entry.userId} className='flex flex-col items-center gap-2 flex-1'>
                  <Avatar className={`ring-2 ${podiumIdx === 1 ? 'w-14 h-14 ring-amber-400' : 'w-11 h-11 ring-white/10'}`}>
                    <AvatarImage src={entry.profilePhoto} className='object-cover' />
                    <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                      {entry.fullName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='text-center'>
                    <p className='text-xs font-semibold truncate max-w-[80px]' style={{ color: 'var(--app-text)' }}>
                      {entry.fullName?.split(' ')[0]}
                    </p>
                    <p className={`text-xs font-bold ${lvl.color}`}>{entry.totalXP} XP</p>
                  </div>
                  <div className={`w-full surface rounded-t-xl flex items-center justify-center ${heights[podiumIdx]}`}>
                    <span className='text-2xl'>{medals[podiumIdx]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <div className='surface-lg overflow-hidden'>
          {isLoading ? (
            <div className='p-6 space-y-3'>
              {[...Array(10)].map((_, i) => (
                <div key={i} className='flex items-center gap-3 animate-pulse'>
                  <div className='w-8 h-8 rounded-full' style={{ background: 'var(--app-surface-2)' }} />
                  <div className='w-8 h-8 rounded-full' style={{ background: 'var(--app-surface-2)' }} />
                  <div className='flex-1 h-4 rounded-lg' style={{ background: 'var(--app-surface-2)' }} />
                  <div className='w-16 h-4 rounded-lg' style={{ background: 'var(--app-surface-2)' }} />
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className='p-16 text-center'>
              <Trophy className='w-10 h-10 mx-auto mb-3' style={{ color: 'var(--app-text-4)' }} />
              <p style={{ color: 'var(--app-text-4)' }}>No data yet — complete modules to earn XP!</p>
            </div>
          ) : (
            <div>
              {list.map((entry) => {
                const lvl = getLevel(entry.totalXP)
                const isMe = entry.isCurrentUser
                return (
                  <div key={entry.userId}
                    className='flex items-center gap-4 px-5 py-3.5 border-b transition-colors'
                    style={{
                      borderBottomColor: 'var(--app-border)',
                      background: isMe ? 'rgba(99,102,241,0.06)' : 'transparent',
                    }}>
                    {/* Rank */}
                    <div className='w-7 text-center flex-shrink-0'>
                      {entry.rank <= 3
                        ? <span className='text-lg'>{MEDALS[entry.rank - 1]}</span>
                        : <span className='text-sm font-bold' style={{ color: 'var(--app-text-4)' }}>#{entry.rank}</span>
                      }
                    </div>

                    {/* Avatar */}
                    <Avatar className='w-8 h-8 flex-shrink-0'>
                      <AvatarImage src={entry.profilePhoto} className='object-cover' />
                      <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                        {entry.fullName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name + level */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold truncate' style={{ color: 'var(--app-text)' }}>
                          {entry.fullName}
                          {isMe && <span className='ml-2 text-xs font-bold text-indigo-400'>(you)</span>}
                        </p>
                      </div>
                      <p className={`text-xs font-medium ${lvl.color}`}>{lvl.title}</p>
                    </div>

                    {/* Stats */}
                    <div className='flex items-center gap-4 flex-shrink-0'>
                      <div className='hidden sm:flex items-center gap-1 text-xs'
                        style={{ color: 'var(--app-text-4)' }}>
                        <Flame className='w-3 h-3 text-orange-400' />
                        {entry.streak}
                      </div>
                      <div className='hidden sm:flex items-center gap-1 text-xs'
                        style={{ color: 'var(--app-text-4)' }}>
                        <BookOpen className='w-3 h-3' />
                        {entry.modulesCompleted}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Zap className='w-3.5 h-3.5 text-indigo-400' />
                        <span className='text-sm font-bold' style={{ color: 'var(--app-text)' }}>{entry.totalXP}</span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Current user outside top 20 */}
              {currentUserEntry && (
                <>
                  <div className='py-2 px-5 text-center text-xs' style={{ color: 'var(--app-text-4)' }}>
                    · · ·
                  </div>
                  <div className='flex items-center gap-4 px-5 py-3.5 border-t'
                    style={{
                      borderTopColor: 'rgba(99,102,241,0.3)',
                      background: 'rgba(99,102,241,0.06)',
                    }}>
                    <div className='w-7 text-center flex-shrink-0'>
                      <span className='text-sm font-bold' style={{ color: 'var(--app-text-4)' }}>
                        #{currentUserEntry.rank}
                      </span>
                    </div>
                    <Avatar className='w-8 h-8 flex-shrink-0'>
                      <AvatarImage src={currentUserEntry.profilePhoto} className='object-cover' />
                      <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                        {currentUserEntry.fullName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold truncate' style={{ color: 'var(--app-text)' }}>
                        {currentUserEntry.fullName} <span className='text-xs font-bold text-indigo-400'>(you)</span>
                      </p>
                      <p className={`text-xs font-medium ${getLevel(currentUserEntry.totalXP).color}`}>
                        {getLevel(currentUserEntry.totalXP).title}
                      </p>
                    </div>
                    <div className='flex items-center gap-1 flex-shrink-0'>
                      <Zap className='w-3.5 h-3.5 text-indigo-400' />
                      <span className='text-sm font-bold' style={{ color: 'var(--app-text)' }}>{currentUserEntry.totalXP}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
