import { Spinner } from '@/components/ui/spinner'
import { useGetSingleCourseHook } from '@/hooks/course.hook'
import { usePayment } from '@/hooks/payment.hook'
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ArrowLeft, BookOpen, Users, Star, CheckCircle2,
  Play, Zap, Lock, ChevronDown, ChevronUp
} from 'lucide-react'

const SingleCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetSingleCourseHook(id)
  const { mutate, isPending } = usePayment()
  const [showAllModules, setShowAllModules] = useState(false)

  const purchaseHandler = () => {
    mutate({ products: { _id: data._id, name: data.title, price: data.amount, image: data.thumbnail } })
  }

  const features = [
    'Full lifetime access',
    'Access on all devices',
    'AI-generated quizzes',
    'Certificate of completion',
    'Community discussions',
    'Expert-curated content',
  ]

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#09090b] p-8'>
        <div className='max-w-6xl mx-auto animate-pulse space-y-6'>
          <div className='h-5 w-32 bg-zinc-800 rounded-lg' />
          <div className='grid md:grid-cols-5 gap-8'>
            <div className='md:col-span-3 space-y-4'>
              <div className='h-72 bg-zinc-800 rounded-2xl' />
              <div className='h-5 bg-zinc-800 rounded-lg w-3/4' />
              <div className='h-4 bg-zinc-800/50 rounded-lg' />
            </div>
            <div className='md:col-span-2'>
              <div className='h-80 bg-zinc-800 rounded-2xl' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const moduleCount = data?.modules?.length || 0
  const originalPrice = Number(data?.amount) + 999
  const visibleModules = showAllModules ? data?.modules : data?.modules?.slice(0, 5)

  return (
    <div className='min-h-screen bg-[#09090b]'>
      <div className='max-w-6xl mx-auto px-6 pt-8 pb-20'>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-1.5 text-zinc-600 hover:text-white text-sm transition-colors mb-8'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </button>

        <div className='grid md:grid-cols-5 gap-10'>
          {/* Left column */}
          <div className='md:col-span-3 space-y-5'>
            {/* Course image */}
            <div className='relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/5'>
              <img
                src={data?.thumbnail}
                alt={data?.title}
                className='w-full h-64 object-cover opacity-80'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-14 h-14 glass rounded-full flex items-center justify-center
                  hover:bg-white/10 transition-colors cursor-pointer border border-white/20'>
                  <Play className='w-6 h-6 text-white ml-0.5' fill='white' />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-3'>
              {[
                { icon: BookOpen, label: 'Modules', value: moduleCount },
                { icon: Users,    label: 'Students', value: '1.2k+' },
                { icon: Star,     label: 'Rating',   value: '4.8' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className='surface p-4 text-center'>
                  <Icon className='w-4 h-4 text-indigo-400 mx-auto mb-1.5' />
                  <p className='text-lg font-black text-white'>{value}</p>
                  <p className='text-xs text-zinc-600 font-medium'>{label}</p>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div className='surface-lg p-5'>
              <h3 className='font-semibold text-white mb-4 flex items-center gap-2 text-sm'>
                <Zap className='w-4 h-4 text-indigo-400' />
                What's included
              </h3>
              <div className='grid grid-cols-2 gap-2.5'>
                {features.map((f) => (
                  <div key={f} className='flex items-center gap-2 text-sm text-zinc-400'>
                    <CheckCircle2 className='w-3.5 h-3.5 text-indigo-400 flex-shrink-0' />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Course content */}
            {moduleCount > 0 && (
              <div className='surface-lg p-5'>
                <h3 className='font-semibold text-white mb-4 flex items-center gap-2 text-sm'>
                  <BookOpen className='w-4 h-4 text-indigo-400' />
                  Course Content
                  <span className='text-zinc-600 font-normal'>({moduleCount} modules)</span>
                </h3>
                <div className='space-y-2'>
                  {visibleModules?.map((m, i) => (
                    <div key={m._id || i}
                      className='flex items-center gap-3 py-2.5 px-3 rounded-xl bg-zinc-800/50 border border-white/4'>
                      <div className='w-6 h-6 bg-indigo-500/15 rounded-lg flex items-center justify-center
                        text-xs font-bold text-indigo-400 flex-shrink-0'>
                        {i + 1}
                      </div>
                      <span className='text-sm text-zinc-300 line-clamp-1 flex-1'>{m.title}</span>
                      <Lock className='w-3.5 h-3.5 text-zinc-700 flex-shrink-0' />
                    </div>
                  ))}
                  {moduleCount > 5 && (
                    <button
                      onClick={() => setShowAllModules(!showAllModules)}
                      className='w-full flex items-center justify-center gap-1.5 py-2 text-xs text-indigo-400
                        hover:text-indigo-300 transition-colors font-medium'
                    >
                      {showAllModules ? (
                        <><ChevronUp className='w-3.5 h-3.5' /> Show less</>
                      ) : (
                        <><ChevronDown className='w-3.5 h-3.5' /> +{moduleCount - 5} more modules</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Purchase card */}
          <div className='md:col-span-2'>
            <div className='sticky top-20 surface-lg p-6 glow-indigo-sm'>
              <h1 className='text-xl font-black text-white mb-2 leading-tight'>{data?.title}</h1>
              <p className='text-zinc-500 text-sm leading-relaxed mb-5'>{data?.description}</p>

              {/* Price */}
              <div className='mb-5'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-black text-white'>₹{data?.amount}</span>
                  <span className='text-sm text-zinc-600 line-through'>₹{originalPrice}</span>
                </div>
                <span className='inline-flex items-center gap-1 badge-indigo mt-2'>
                  Save ₹999 — Limited offer
                </span>
              </div>

              {/* CTA */}
              {data?.isPurchased ? (
                <button
                  onClick={() => navigate(`/YourCourse/${id}`)}
                  className='btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mb-3'
                >
                  <BookOpen className='w-4 h-4' />
                  Continue Learning
                </button>
              ) : (
                <button
                  disabled={isPending}
                  onClick={purchaseHandler}
                  className='btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mb-3'
                >
                  {isPending ? <Spinner /> : (
                    <><ShoppingCart className='w-4 h-4' /> Enroll Now</>
                  )}
                </button>
              )}

              <p className='text-center text-xs text-zinc-700 mb-5'>30-day money-back guarantee</p>

              <div className='space-y-2 pt-4 border-t border-white/5'>
                {['Secure payment via Stripe', 'Instant access after purchase', 'Cancel anytime'].map((t) => (
                  <div key={t} className='flex items-center gap-2 text-xs text-zinc-600'>
                    <CheckCircle2 className='w-3.5 h-3.5 text-indigo-500 flex-shrink-0' />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCourse
