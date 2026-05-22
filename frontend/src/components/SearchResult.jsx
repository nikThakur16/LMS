import React from 'react'
import { Search, X, Sparkles } from 'lucide-react'

const SearchResult = ({ SearchInput, setSearchInput, handleSubmit, onReset, hasActiveSearch }) => {
  const quickTags = ['MERN Stack', 'React', 'Node.js', 'AI & Machine Learning']

  return (
    <div className='relative overflow-hidden bg-[#09090b] py-20 px-6'>
      {/* Background gradient orbs */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
          bg-indigo-500/10 rounded-full blur-[80px]' />
        <div className='absolute bottom-0 right-1/4 w-[400px] h-[200px]
          bg-violet-500/8 rounded-full blur-[60px]' />
      </div>

      {/* Top line */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent' />

      <div className='relative max-w-3xl mx-auto text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 badge-indigo mb-5'>
          <Sparkles className='w-3.5 h-3.5' />
          AI-Powered Course Search
        </div>

        {/* Heading */}
        <h1 className='text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight leading-tight'>
          Learn Without<br />
          <span className='gradient-text'>Limits</span>
        </h1>
        <p className='text-zinc-500 text-base mb-10 max-w-md mx-auto'>
          Search our curated library of expert-led courses
        </p>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className='flex gap-2 max-w-xl mx-auto mb-5'>
          <div className='relative flex-1'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600' />
            <input
              value={SearchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type='text'
              placeholder='Search courses, skills, topics...'
              className='input-dark w-full pl-10 pr-10 py-2.5 text-sm'
            />
            {SearchInput && (
              <button
                type='button'
                onClick={() => setSearchInput('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>
          <button type='submit' className='btn-primary px-5 py-2.5 text-sm whitespace-nowrap'>
            Search
          </button>
        </form>

        {/* Quick tags */}
        <div className='flex flex-wrap justify-center gap-2'>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchInput(tag)}
              className='btn-ghost text-xs px-3 py-1.5 rounded-lg'
            >
              {tag}
            </button>
          ))}
          {hasActiveSearch && (
            <button
              onClick={onReset}
              className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all'
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
