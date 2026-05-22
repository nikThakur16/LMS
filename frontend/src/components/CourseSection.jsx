import { useGetCourseHook } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, Users, ArrowRight, Zap } from 'lucide-react'

const SkeletonCard = () => (
  <div className='surface-lg overflow-hidden animate-pulse'>
    <div className='h-44 bg-zinc-800' />
    <div className='p-5 space-y-3'>
      <div className='h-4 bg-zinc-800 rounded-lg w-3/4' />
      <div className='h-3 bg-zinc-800/60 rounded-lg w-full' />
      <div className='h-3 bg-zinc-800/60 rounded-lg w-2/3' />
      <div className='flex justify-between items-center pt-3'>
        <div className='h-5 bg-zinc-800 rounded-lg w-16' />
        <div className='h-8 bg-zinc-800 rounded-lg w-20' />
      </div>
    </div>
  </div>
)

const CourseSection = ({ ActiveSearch }) => {
  const { data, isLoading } = useGetCourseHook(ActiveSearch)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='py-12 px-6 bg-[#09090b]'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  const courses = data?.courses || []

  if (courses.length === 0) {
    return (
      <div className='py-32 px-6 bg-[#09090b] text-center'>
        <div className='w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5'>
          <BookOpen className='w-7 h-7 text-zinc-600' />
        </div>
        <h2 className='text-xl font-bold text-zinc-300 mb-2'>No courses found</h2>
        <p className='text-zinc-600 text-sm max-w-sm mx-auto'>
          Try a different search term or browse all courses
        </p>
      </div>
    )
  }

  return (
    <div className='py-10 px-6 bg-[#09090b]'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-7'>
          <div>
            <h2 className='text-lg font-bold text-white'>
              {ActiveSearch ? `Results for "${ActiveSearch}"` : 'All Courses'}
            </h2>
            <p className='text-zinc-600 text-sm mt-0.5'>
              {courses.length} course{courses.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {ActiveSearch && (
            <span className='flex items-center gap-1.5 badge-indigo'>
              <Zap className='w-3 h-3' />
              AI Search Active
            </span>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {courses.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/singleCourse/${item._id}`)}
              className='surface-lg overflow-hidden cursor-pointer card-hover group'
            >
              {/* Thumbnail */}
              <div className='relative h-44 overflow-hidden bg-zinc-800'>
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
                  <span className='text-xs font-bold text-white'>{item.avgRating || '4.8'}</span>
                </div>
              </div>

              {/* Content */}
              <div className='p-5'>
                <h3 className='font-semibold text-sm text-white line-clamp-2 mb-2 leading-snug'>
                  {item.title}
                </h3>
                <p className='text-xs text-zinc-600 line-clamp-2 mb-4 leading-relaxed'>
                  {item.description}
                </p>

                <div className='flex items-center gap-3 text-xs text-zinc-600 mb-4'>
                  <span className='flex items-center gap-1'>
                    <BookOpen className='w-3 h-3' />
                    {item.modules?.length || 0} modules
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='w-3 h-3' />
                    {item.enrolled || '1.2k'} students
                  </span>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-white/5'>
                  <div>
                    <span className='text-base font-bold text-white'>₹{item.amount}</span>
                    <span className='text-xs text-zinc-700 line-through ml-2'>
                      ₹{Number(item.amount) + 999}
                    </span>
                  </div>
                  <button className='flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15
                    hover:bg-indigo-500 text-indigo-400 hover:text-white text-xs font-semibold
                    rounded-lg border border-indigo-500/25 hover:border-indigo-500
                    transition-all duration-200'>
                    Enroll
                    <ArrowRight className='w-3 h-3' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseSection
