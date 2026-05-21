import React from 'react'
import { Search, X, Sparkles, TrendingUp, BookOpen, Users } from 'lucide-react'

const SearchResult = ({
  SearchInput,
  setSearchInput,
  handleSubmit,
  onReset,
  hasActiveSearch
}) => {
  const quickTags = [
    'MERN Stack Development',
    'React for Beginners',
    'Advanced JavaScript',
    'Node.js Essentials'
  ]

  const stats = [
    { icon: BookOpen, label: 'Courses', value: '50+' },
    { icon: Users, label: 'Students', value: '2K+' },
    { icon: TrendingUp, label: 'Completion Rate', value: '94%' },
  ]

  return (
    <div className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl' />
      </div>

      <div className='relative max-w-5xl mx-auto px-6 py-14'>
        {/* Heading */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5'>
            <Sparkles className='w-4 h-4' />
            AI-Powered Course Search
          </div>
          <h1 className='text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight'>
            Find Your Next <span className='text-emerald-400'>Skill</span>
          </h1>
          <p className='text-slate-400 text-lg max-w-xl mx-auto'>
            Search from our curated library of expert-led courses
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className='flex items-center gap-3 max-w-2xl mx-auto mb-6'>
          <div className='relative flex-1'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
            <input
              value={SearchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type='text'
              placeholder='Search for courses, skills, or topics...'
              className='w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl
                text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500
                focus:border-emerald-500 transition-all text-base'
            />
            {SearchInput && (
              <button
                type='button'
                onClick={() => setSearchInput('')}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors'
              >
                <X className='w-4 h-4 text-slate-400 hover:text-white' />
              </button>
            )}
          </div>
          <button
            type='submit'
            className='px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold
              rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
              hover:-translate-y-0.5 whitespace-nowrap'
          >
            Search
          </button>
        </form>

        {/* Quick Tags */}
        <div className='flex flex-wrap justify-center gap-2 mb-6'>
          {quickTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => setSearchInput(tag)}
              className='px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/10
                hover:border-white/30 rounded-xl text-sm font-medium text-slate-300
                hover:text-white transition-all'
            >
              {tag}
            </button>
          ))}
        </div>

        {hasActiveSearch && (
          <div className='flex justify-center'>
            <button
              onClick={onReset}
              className='flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10
                border border-white/10 text-slate-400 hover:text-white text-sm font-medium
                rounded-xl transition-all'
            >
              <X className='w-4 h-4' />
              Clear search
            </button>
          </div>
        )}

        {/* Stats */}
        <div className='flex justify-center gap-12 mt-10 pt-8 border-t border-white/10'>
          {stats.map((s, i) => (
            <div key={i} className='flex flex-col items-center gap-1'>
              <s.icon className='w-5 h-5 text-emerald-400 mb-1' />
              <span className='text-2xl font-black text-white'>{s.value}</span>
              <span className='text-xs text-slate-500 font-medium uppercase tracking-wider'>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
