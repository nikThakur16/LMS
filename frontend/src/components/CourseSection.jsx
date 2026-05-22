import { useGetCourseHook } from '@/hooks/course.hook'
import { useGetWishlist, useAddWishlist, useRemoveWishlist } from '@/hooks/wishlist.hook'
import { useUserStore } from '@/Store/user.store'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, Users, ArrowRight, Zap, Heart, Award } from 'lucide-react'

const getLevelLabel = (amount) => {
  if (amount >= 2000) return 'Advanced'
  if (amount >= 1000) return 'Intermediate'
  return 'Beginner'
}

const getLevelStyle = (label) => ({
  Beginner:     { bg: 'rgba(6,182,212,0.12)',  color: '#22d3ee', border: 'rgba(6,182,212,0.25)'  },
  Intermediate: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  Advanced:     { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
}[label])

const SkeletonCard = () => (
  <div className='surface-lg overflow-hidden animate-pulse'>
    <div className='h-44' style={{ background: 'var(--app-surface-2)' }} />
    <div className='p-5 space-y-3'>
      <div className='h-4 rounded-lg w-3/4' style={{ background: 'var(--app-surface-2)' }} />
      <div className='h-3 rounded-lg w-full' style={{ background: 'var(--app-surface-2)', opacity: 0.6 }} />
      <div className='h-3 rounded-lg w-2/3' style={{ background: 'var(--app-surface-2)', opacity: 0.6 }} />
      <div className='flex justify-between items-center pt-3'>
        <div className='h-5 rounded-lg w-16' style={{ background: 'var(--app-surface-2)' }} />
        <div className='h-8 rounded-lg w-20' style={{ background: 'var(--app-surface-2)' }} />
      </div>
    </div>
  </div>
)

const CourseSection = ({ activeSearch, activeCategory }) => {
  const { data, isLoading } = useGetCourseHook(activeSearch)
  const { data: wishlistData } = useGetWishlist()
  const { mutate: addWishlist } = useAddWishlist()
  const { mutate: removeWishlist } = useRemoveWishlist()
  const { user } = useUserStore()
  const navigate = useNavigate()

  const wishlistIds = new Set((wishlistData?.courses || []).map(c => c._id))

  const toggleWishlist = (e, courseId) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    wishlistIds.has(courseId) ? removeWishlist(courseId) : addWishlist(courseId)
  }

  if (isLoading) {
    return (
      <div className='py-12 px-6' style={{ background: 'var(--app-bg)' }}>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  const allCourses = data?.courses || []

  /* Sort by amount descending to identify "bestsellers" (top 2) */
  const sortedByPrice = [...allCourses].sort((a, b) => b.amount - a.amount)
  const bestsellerIds = new Set(sortedByPrice.slice(0, 2).map(c => c._id))

  /* Sort by createdAt for sections */
  const sorted = [...allCourses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const newArrivals  = sorted.slice(0, 4)
  const highestRated = [...allCourses].sort((a, b) => (b.avgRating || 4.5) - (a.avgRating || 4.5)).slice(0, 4)

  if (allCourses.length === 0) {
    return (
      <div className='py-32 px-6 text-center' style={{ background: 'var(--app-bg)' }}>
        <div className='w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5'
          style={{ background: 'var(--app-surface-2)' }}>
          <BookOpen className='w-7 h-7' style={{ color: 'var(--app-text-4)' }} />
        </div>
        <h2 className='text-xl font-bold mb-2' style={{ color: 'var(--app-text-2)' }}>No courses found</h2>
        <p className='text-sm max-w-sm mx-auto' style={{ color: 'var(--app-text-4)' }}>
          Try a different search term or browse all courses
        </p>
      </div>
    )
  }

  /* When searching/filtering, show flat list; otherwise show sections */
  const showSections = !activeSearch && activeCategory === 'All'

  const CourseCard = ({ item }) => {
    const level = getLevelLabel(item.amount)
    const ls = getLevelStyle(level)
    const isBestseller = bestsellerIds.has(item._id)
    const isWishlisted = wishlistIds.has(item._id)

    return (
      <div
        onClick={() => navigate(`/singleCourse/${item._id}`)}
        className='surface-lg overflow-hidden cursor-pointer card-hover group relative'
      >
        {/* Bestseller ribbon */}
        {isBestseller && (
          <div className='absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1
            bg-amber-400 text-black text-xs font-black rounded-md shadow-lg'>
            <Award className='w-3 h-3' />
            Bestseller
          </div>
        )}

        {/* Thumbnail */}
        <div className='relative h-44 overflow-hidden' style={{ background: 'var(--app-surface-2)' }}>
          <img
            src={item.thumbnail}
            alt={item.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

          {/* Rating chip */}
          <div className='absolute top-3 right-3 flex items-center gap-1
            bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10'>
            <Star className='w-3 h-3 text-amber-400 fill-amber-400' />
            <span className='text-xs font-bold text-white'>{item.avgRating?.toFixed(1) || '4.8'}</span>
          </div>

          {/* Wishlist button */}
          {!user?.admin && (
            <button
              onClick={(e) => toggleWishlist(e, item._id)}
              className='absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center
                rounded-full backdrop-blur-sm border transition-all duration-150'
              style={isWishlisted ? {
                background: 'rgba(239,68,68,0.9)',
                borderColor: 'rgba(239,68,68,0.5)',
              } : {
                background: 'rgba(0,0,0,0.5)',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Heart className='w-3.5 h-3.5' fill={isWishlisted ? 'white' : 'none'} color='white' />
            </button>
          )}
        </div>

        {/* Content */}
        <div className='p-4'>
          {/* Level badge */}
          <div className='inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 border'
            style={{ background: ls.bg, color: ls.color, borderColor: ls.border }}>
            {level}
          </div>

          <h3 className='font-semibold text-sm line-clamp-2 mb-1.5 leading-snug'
            style={{ color: 'var(--app-text)' }}>
            {item.title}
          </h3>
          <p className='text-xs line-clamp-2 mb-3 leading-relaxed' style={{ color: 'var(--app-text-4)' }}>
            {item.description}
          </p>

          <div className='flex items-center gap-3 text-xs mb-3' style={{ color: 'var(--app-text-4)' }}>
            <span className='flex items-center gap-1'>
              <BookOpen className='w-3 h-3' />
              {item.modules?.length || 0} modules
            </span>
            <span className='flex items-center gap-1'>
              <Users className='w-3 h-3' />
              {item.studentCount || '1.2k'} students
            </span>
          </div>

          <div className='flex items-center justify-between pt-3 border-t'
            style={{ borderTopColor: 'var(--app-border)' }}>
            <div>
              <span className='text-base font-bold' style={{ color: 'var(--app-text)' }}>₹{item.amount}</span>
              <span className='text-xs line-through ml-2' style={{ color: 'var(--app-text-4)' }}>
                ₹{Number(item.amount) + 999}
              </span>
            </div>
            <button className='flex items-center gap-1.5 px-3 py-1.5
              bg-indigo-500/15 hover:bg-indigo-500 text-indigo-400 hover:text-white text-xs font-semibold
              rounded-lg border border-indigo-500/25 hover:border-indigo-500
              transition-all duration-200'>
              Enroll
              <ArrowRight className='w-3 h-3' />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!showSections) {
    return (
      <div className='py-10 px-6' style={{ background: 'var(--app-bg)' }}>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-7'>
            <div>
              <h2 className='text-lg font-bold' style={{ color: 'var(--app-text)' }}>
                {activeSearch ? `Results for "${activeSearch}"` : `Category: ${activeCategory}`}
              </h2>
              <p className='text-sm mt-0.5' style={{ color: 'var(--app-text-4)' }}>
                {allCourses.length} course{allCourses.length !== 1 ? 's' : ''} found
              </p>
            </div>
            {activeSearch && (
              <span className='flex items-center gap-1.5 badge-indigo'>
                <Zap className='w-3 h-3' />
                AI Search
              </span>
            )}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {allCourses.map((item) => <CourseCard key={item._id} item={item} />)}
          </div>
        </div>
      </div>
    )
  }

  const Section = ({ title, courses }) => (
    <div className='mb-12'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-base font-bold' style={{ color: 'var(--app-text)' }}>{title}</h2>
        <span className='text-xs' style={{ color: 'var(--app-text-4)' }}>{courses.length} courses</span>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {courses.map((item) => <CourseCard key={item._id} item={item} />)}
      </div>
    </div>
  )

  return (
    <div className='py-10 px-6' style={{ background: 'var(--app-bg)' }}>
      <div className='max-w-7xl mx-auto'>
        <Section title='🔥 Trending Now' courses={highestRated} />
        <Section title='🆕 New Arrivals' courses={newArrivals} />
        {allCourses.length > 4 && (
          <Section title='📚 All Courses'
            courses={[...allCourses].sort((a, b) => a.title.localeCompare(b.title))} />
        )}
      </div>
    </div>
  )
}

export default CourseSection
