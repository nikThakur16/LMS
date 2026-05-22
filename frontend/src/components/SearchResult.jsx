import React from 'react'
import { Search, X, Sparkles, Users, BookOpen, Star } from 'lucide-react'
import { useThemeStore } from '@/Store/theme.store'

const CATEGORIES = ['All', 'MERN Stack', 'AI/ML', 'DevOps', 'Mobile', 'System Design', 'React', 'Node.js']

const SearchResult = ({ searchInput, setSearchInput, handleSubmit, onReset, hasActiveSearch, activeCategory, onCategorySelect }) => {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className='relative overflow-hidden py-16 px-6 transition-colors duration-200'
      style={{ background: 'var(--app-bg)' }}>

      {/* Background gradient orbs */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px]
          rounded-full blur-[100px]'
          style={{ background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)' }} />
        <div className='absolute bottom-0 right-1/4 w-[400px] h-[200px]
          rounded-full blur-[80px]'
          style={{ background: isDark ? 'rgba(139,92,246,0.07)' : 'rgba(139,92,246,0.04)' }} />
      </div>

      {/* Top accent line */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent' />

      <div className='relative max-w-3xl mx-auto text-center'>
        {/* AI badge */}
        <div className='inline-flex items-center gap-2 badge-indigo mb-5'>
          <Sparkles className='w-3.5 h-3.5' />
          AI-Powered Learning Platform
        </div>

        {/* Heading */}
        <h1 className='text-4xl lg:text-5xl font-black mb-3 tracking-tight leading-tight'
          style={{ color: 'var(--app-text)' }}>
          Learn Without<br />
          <span className='gradient-text'>Limits</span>
        </h1>
        <p className='text-base mb-8 max-w-md mx-auto' style={{ color: 'var(--app-text-3)' }}>
          Search our curated library of expert-led courses
        </p>

        {/* Stats bar */}
        <div className='flex items-center justify-center gap-6 mb-8'>
          {[
            { icon: Users, value: '50,000+', label: 'students' },
            { icon: BookOpen, value: '120+', label: 'courses' },
            { icon: Star, value: '4.8★', label: 'avg rating' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className='flex items-center gap-2'>
              <Icon className='w-4 h-4 text-indigo-400' />
              <span className='text-sm font-bold' style={{ color: 'var(--app-text)' }}>{value}</span>
              <span className='text-sm' style={{ color: 'var(--app-text-4)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className='flex gap-2 max-w-xl mx-auto mb-5'>
          <div className='relative flex-1'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4' style={{ color: 'var(--app-text-4)' }} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type='text'
              placeholder='Search courses, skills, topics...'
              className='input-dark w-full pl-10 pr-10 py-3 text-sm'
            />
            {searchInput && (
              <button
                type='button'
                onClick={() => setSearchInput('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 transition-colors'
                style={{ color: 'var(--app-text-4)' }}
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>
          <button type='submit' className='btn-primary px-6 py-3 text-sm whitespace-nowrap rounded-xl'>
            Search
          </button>
        </form>

        {/* Category chips */}
        <div className='flex flex-wrap justify-center gap-2'>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className='text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-150 border'
                style={isActive ? {
                  background: 'rgba(99,102,241,0.15)',
                  color: '#818cf8',
                  borderColor: 'rgba(99,102,241,0.35)',
                } : {
                  background: 'var(--app-surface)',
                  color: 'var(--app-text-3)',
                  borderColor: 'var(--app-border)',
                }}
              >
                {cat}
              </button>
            )
          })}
          {hasActiveSearch && (
            <button
              onClick={onReset}
              className='flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full
                border transition-all'
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: '#f87171',
                borderColor: 'rgba(239,68,68,0.2)',
              }}
            >
              <X className='w-3 h-3' /> Clear search
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
