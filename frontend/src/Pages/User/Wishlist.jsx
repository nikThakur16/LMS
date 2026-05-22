import React from 'react'
import { useGetWishlist, useRemoveWishlist } from '@/hooks/wishlist.hook'
import { useNavigate } from 'react-router-dom'
import { Heart, BookOpen, ArrowRight, Trash2 } from 'lucide-react'

const Wishlist = () => {
  const { data, isLoading } = useGetWishlist()
  const { mutate: removeWishlist } = useRemoveWishlist()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='min-h-screen px-6 py-10' style={{ background: 'var(--app-bg)' }}>
        <div className='max-w-6xl mx-auto'>
          <div className='h-7 w-40 rounded-lg animate-pulse mb-8' style={{ background: 'var(--app-surface-2)' }} />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {[1,2,3].map(i => (
              <div key={i} className='surface-lg overflow-hidden animate-pulse'>
                <div className='h-44' style={{ background: 'var(--app-surface-2)' }} />
                <div className='p-4 space-y-3'>
                  <div className='h-4 rounded-lg w-3/4' style={{ background: 'var(--app-surface-2)' }} />
                  <div className='h-3 rounded-lg' style={{ background: 'var(--app-surface-2)', opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const courses = data?.courses || []

  return (
    <div className='min-h-screen px-6 py-10' style={{ background: 'var(--app-bg)' }}>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-black tracking-tight mb-1 flex items-center gap-2.5'
            style={{ color: 'var(--app-text)' }}>
            <Heart className='w-6 h-6 text-red-400' fill='#f87171' />
            Wishlist
          </h1>
          <p className='text-sm' style={{ color: 'var(--app-text-4)' }}>
            {courses.length} saved course{courses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {!courses.length ? (
          <div className='surface-lg p-16 text-center'>
            <div className='w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5'
              style={{ background: 'var(--app-surface-2)' }}>
              <Heart className='w-7 h-7' style={{ color: 'var(--app-text-4)' }} />
            </div>
            <h2 className='text-lg font-bold mb-2' style={{ color: 'var(--app-text-2)' }}>No saved courses yet</h2>
            <p className='text-sm mb-6 max-w-xs mx-auto' style={{ color: 'var(--app-text-4)' }}>
              Browse courses and click the heart icon to save them here
            </p>
            <button onClick={() => navigate('/')} className='btn-primary px-6 py-2.5 text-sm'>
              Browse Courses
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {courses.map((item) => (
              <div key={item._id} className='surface-lg overflow-hidden card-hover group'>
                {/* Thumbnail */}
                <div className='relative h-44 overflow-hidden' style={{ background: 'var(--app-surface-2)' }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer'
                    onClick={() => navigate(`/singleCourse/${item._id}`)}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none' />
                </div>

                <div className='p-4'>
                  <h3 className='font-semibold text-sm line-clamp-2 mb-1.5 leading-snug cursor-pointer'
                    style={{ color: 'var(--app-text)' }}
                    onClick={() => navigate(`/singleCourse/${item._id}`)}>
                    {item.title}
                  </h3>
                  <div className='flex items-center gap-1 text-xs mb-4' style={{ color: 'var(--app-text-4)' }}>
                    <BookOpen className='w-3 h-3' />
                    {item.modules?.length || 0} modules
                    <span className='ml-auto font-bold' style={{ color: 'var(--app-text)' }}>₹{item.amount}</span>
                  </div>

                  <div className='flex gap-2'>
                    <button
                      onClick={() => navigate(`/singleCourse/${item._id}`)}
                      className='flex-1 flex items-center justify-center gap-1.5 py-2
                        btn-primary text-xs font-semibold rounded-lg'>
                      Enroll Now
                      <ArrowRight className='w-3 h-3' />
                    </button>
                    <button
                      onClick={() => removeWishlist(item._id)}
                      className='w-9 h-9 flex items-center justify-center rounded-lg border transition-all'
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        borderColor: 'rgba(239,68,68,0.2)',
                        color: '#f87171',
                      }}
                      title='Remove from wishlist'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
