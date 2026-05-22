import CourseSection from '@/components/CourseSection'
import SearchResult from '@/components/SearchResult'
import React, { useState } from 'react'

const Home = () => {
  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const handleSubmit = (e) => {
    e.preventDefault()
    setActiveSearch(searchInput)
    setActiveCategory('All')
  }

  const handleCategorySelect = (category) => {
    setActiveCategory(category)
    const query = category === 'All' ? '' : category
    setSearchInput(query)
    setActiveSearch(query)
  }

  const resetFilter = () => {
    setSearchInput('')
    setActiveSearch('')
    setActiveCategory('All')
  }

  return (
    <div className='min-h-screen' style={{ background: 'var(--app-bg)' }}>
      <SearchResult
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSubmit={handleSubmit}
        onReset={resetFilter}
        hasActiveSearch={!!activeSearch}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />
      <CourseSection activeSearch={activeSearch} activeCategory={activeCategory} />
    </div>
  )
}

export default Home
