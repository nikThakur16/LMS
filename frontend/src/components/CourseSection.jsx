import { useGetCourseHook } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, Users, ArrowRight, Zap } from 'lucide-react'

const CourseSection = ({ ActiveSearch }) => {
  const { data, isLoading } = useGetCourseHook(ActiveSearch)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='py-16 px-6 bg-slate-50'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse'>
              <div className='h-48 bg-slate-200' />
              <div className='p-5 space-y-3'>
                <div className='h-5 bg-slate-200 rounded-lg w-3/4' />
                <div className='h-4 bg-slate-100 rounded-lg w-full' />
                <div className='h-4 bg-slate-100 rounded-lg w-2/3' />
                <div className='flex justify-between items-center pt-2'>
                  <div className='h-6 bg-slate-200 rounded-lg w-16' />
                  <div className='h-9 bg-slate-200 rounded-xl w-24' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const courses = data?.courses || []

  if (courses.length === 0) {
    return (
      <div className='py-32 px-6 bg-slate-50 text-center'>
        <BookOpen className='w-20 h-20 text-slate-300 mx-auto mb-6' />
        <h2 className='text-2xl font-bold text-slate-800 mb-2'>No courses found</h2>
        <p className='text-slate-500 max-w-sm mx-auto'>
          Try a different search term or browse all courses
        </p>
      </div>
    )
  }

  return (
    <div className='py-14 px-6 bg-slate-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Section header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-black text-slate-900'>
              {ActiveSearch ? `Results for "${ActiveSearch}"` : 'All Courses'}
            </h2>
            <p className='text-slate-500 mt-1'>{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
          </div>
          {ActiveSearch && (
            <span className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200'>
              <Zap className='w-3.5 h-3.5' />
              AI Search Active
            </span>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {courses.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/singleCourse/${item._id}`)}
              className='group bg-white border border-slate-200 rounded-2xl overflow-hidden
                hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-200
                cursor-pointer transition-all duration-300'
            >
              {/* Thumbnail */}
              <div className='relative h-48 overflow-hidden bg-slate-100'>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm'>
                  <Star className='w-3.5 h-3.5 text-amber-400 fill-amber-400' />
                  <span className='text-xs font-bold text-slate-800'>{item.rating || '4.8'}</span>
                </div>
              </div>

              {/* Content */}
              <div className='p-5'>
                <h3 className='font-bold text-base text-slate-900 line-clamp-2 mb-2 leading-snug group-hover:text-emerald-700 transition-colors'>
                  {item.title}
                </h3>
                <p className='text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed'>
                  {item.description}
                </p>

                <div className='flex items-center gap-3 text-xs text-slate-500 mb-4'>
                  <span className='flex items-center gap-1'>
                    <BookOpen className='w-3.5 h-3.5' />
                    {item.modules?.length || 0} modules
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users className='w-3.5 h-3.5' />
                    {item.enrolled || '1.2k'} students
                  </span>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-slate-100'>
                  <div>
                    <span className='text-xl font-black text-slate-900'>₹{item.amount}</span>
                    <span className='text-xs text-slate-400 line-through ml-2'>₹{Number(item.amount) + 999}</span>
                  </div>
                  <button className='flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-emerald-600
                    text-white text-sm font-semibold rounded-xl transition-all duration-200
                    group-hover:shadow-lg group-hover:shadow-emerald-500/20'>
                    Enroll
                    <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
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
