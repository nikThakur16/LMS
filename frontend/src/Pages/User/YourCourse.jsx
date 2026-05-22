import { useGetAllPurchaseCourse } from '@/hooks/course.hook'
import { useGetProgress } from '@/hooks/progress.hook'
import { BookOpen, Play, ChevronRight, GraduationCap } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourseProgressBar = ({ courseId }) => {
  const { data } = useGetProgress(courseId)
  const percent = data?.percentage || 0
  const completed = data?.completedCount || 0
  const total = data?.totalModules || 0
  return (
    <div className='space-y-1.5 mt-3'>
      <div className='flex items-center justify-between text-xs'>
        <span className='text-zinc-600'>{completed}/{total} modules</span>
        <span className={`font-semibold ${percent === 100 ? 'text-green-400' : 'text-indigo-400'}`}>
          {percent}%
        </span>
      </div>
      <div className='progress-bar'>
        <div
          className='progress-fill'
          style={{
            width: `${percent}%`,
            background: percent === 100
              ? 'linear-gradient(90deg,#22c55e,#4ade80)'
              : undefined
          }}
        />
      </div>
    </div>
  )
}

const YourCourse = () => {
  const { data, isLoading } = useGetAllPurchaseCourse()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='min-h-screen bg-transparent p-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='h-7 w-48 bg-zinc-800 rounded-lg animate-pulse mb-8' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {[1,2,3,4].map((i) => (
              <div key={i} className='surface-lg overflow-hidden animate-pulse'>
                <div className='h-44' style={{ background: 'var(--app-surface-2)' }} />
                <div className='p-4 space-y-3'>
                  <div className='h-4 rounded-lg w-3/4' style={{ background: 'var(--app-surface-2)' }} />
                  <div className='h-3 rounded-lg' style={{ background: 'var(--app-surface-2)', opacity: 0.6 }} />
                  <div className='h-8 rounded-lg mt-4' style={{ background: 'var(--app-surface-2)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const courses = data?.purchasedCourse || []

  return (
    <div className='min-h-screen bg-transparent px-6 py-10'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-black text-white tracking-tight mb-1'>My Learning</h1>
          <p className='text-zinc-600 text-sm'>
            {courses.length} enrolled course{courses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Empty state */}
        {!courses.length ? (
          <div className='surface-lg p-16 text-center'>
            <div className='w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5'>
              <GraduationCap className='w-7 h-7 text-zinc-600' />
            </div>
            <h2 className='text-lg font-bold text-zinc-300 mb-2'>No courses yet</h2>
            <p className='text-zinc-600 text-sm mb-6 max-w-xs mx-auto'>
              Explore our course catalog and start learning today
            </p>
            <button
              onClick={() => navigate('/')}
              className='btn-primary px-6 py-2.5 text-sm'
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {courses.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => navigate(`/YourCourse/${item._id}`)}
                className='surface-lg overflow-hidden cursor-pointer card-hover group'
              >
                {/* Thumbnail */}
                <div className='relative h-44 overflow-hidden' style={{ background: 'var(--app-surface-2)' }}>
                  <img
                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'
                    src={item.thumbnail}
                    alt={item.title}
                  />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-all duration-300 flex items-center justify-center'>
                    <div className='w-12 h-12 glass rounded-full flex items-center justify-center border border-white/20'>
                      <Play className='w-5 h-5 text-white ml-0.5' fill='white' />
                    </div>
                  </div>
                </div>

                <div className='p-4'>
                  <h3 className='font-semibold text-sm text-white line-clamp-2 leading-snug mb-1'>
                    {item.title}
                  </h3>
                  <div className='flex items-center gap-1 text-xs text-zinc-600 mb-1'>
                    <BookOpen className='w-3 h-3' />
                    {item.modules?.length || 0} modules
                  </div>

                  {/* Per-course progress bar */}
                  <CourseProgressBar courseId={item._id} />

                  <button className='mt-4 w-full flex items-center justify-center gap-1.5 py-2
                    btn-ghost text-xs font-semibold rounded-lg'>
                    Continue
                    <ChevronRight className='w-3.5 h-3.5' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default YourCourse
