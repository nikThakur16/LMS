import { Spinner } from '@/components/ui/spinner'
import { useGetSingleCourseHook } from '@/hooks/course.hook'
import { usePayment } from '@/hooks/payment.hook'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, BookOpen, Clock, Users, Star, CheckCircle, Play, Zap } from 'lucide-react'

const SingleCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetSingleCourseHook(id)
  const { mutate, isPending } = usePayment()

  const purchaseHandler = () => {
    mutate({
      products: {
        _id: data._id,
        name: data.title,
        price: data.amount,
        image: data.thumbnail,
      }
    })
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
      <div className='min-h-screen bg-slate-50 p-8'>
        <div className='max-w-5xl mx-auto animate-pulse space-y-6'>
          <div className='h-8 w-40 bg-slate-200 rounded-lg' />
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='h-80 bg-slate-200 rounded-2xl' />
            <div className='space-y-4'>
              <div className='h-8 bg-slate-200 rounded-lg' />
              <div className='h-4 bg-slate-100 rounded-lg w-3/4' />
              <div className='h-4 bg-slate-100 rounded-lg w-1/2' />
              <div className='h-12 bg-slate-200 rounded-xl mt-8' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const moduleCount = data?.modules?.length || 0
  const originalPrice = Number(data?.amount) + 999

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Back button */}
      <div className='max-w-5xl mx-auto px-6 pt-8'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors mb-8'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to courses
        </button>
      </div>

      <div className='max-w-5xl mx-auto px-6 pb-16'>
        <div className='grid md:grid-cols-5 gap-10'>

          {/* Left - Image + features */}
          <div className='md:col-span-3 space-y-6'>
            {/* Course image */}
            <div className='relative rounded-2xl overflow-hidden shadow-xl bg-slate-900'>
              <img
                src={data?.thumbnail}
                alt={data?.title}
                className='w-full h-72 object-cover opacity-90'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors cursor-pointer'>
                  <Play className='w-7 h-7 text-white ml-1' fill='white' />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className='grid grid-cols-3 gap-4'>
              {[
                { icon: BookOpen, label: 'Modules', value: moduleCount },
                { icon: Users, label: 'Students', value: '1.2k+' },
                { icon: Star, label: 'Rating', value: '4.8' },
              ].map((s, i) => (
                <div key={i} className='bg-white rounded-xl p-4 border border-slate-200 text-center'>
                  <s.icon className='w-5 h-5 text-emerald-600 mx-auto mb-1' />
                  <p className='text-xl font-black text-slate-900'>{s.value}</p>
                  <p className='text-xs text-slate-500 font-medium'>{s.label}</p>
                </div>
              ))}
            </div>

            {/* What you'll get */}
            <div className='bg-white rounded-2xl border border-slate-200 p-6'>
              <h3 className='font-bold text-slate-900 mb-4 flex items-center gap-2'>
                <Zap className='w-5 h-5 text-emerald-600' />
                What's included
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                {features.map((f, i) => (
                  <div key={i} className='flex items-center gap-2 text-sm text-slate-700'>
                    <CheckCircle className='w-4 h-4 text-emerald-500 flex-shrink-0' />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Module list preview */}
            {moduleCount > 0 && (
              <div className='bg-white rounded-2xl border border-slate-200 p-6'>
                <h3 className='font-bold text-slate-900 mb-4 flex items-center gap-2'>
                  <BookOpen className='w-5 h-5 text-emerald-600' />
                  Course Content ({moduleCount} modules)
                </h3>
                <div className='space-y-2'>
                  {data.modules.slice(0, 5).map((m, i) => (
                    <div key={m._id || i} className='flex items-center gap-3 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100'>
                      <div className='w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-700 flex-shrink-0'>
                        {i + 1}
                      </div>
                      <span className='text-sm font-medium text-slate-800 line-clamp-1'>{m.title}</span>
                      <Clock className='w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0' />
                    </div>
                  ))}
                  {moduleCount > 5 && (
                    <p className='text-sm text-slate-500 text-center pt-1'>+{moduleCount - 5} more modules</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right - Purchase card (sticky) */}
          <div className='md:col-span-2'>
            <div className='sticky top-6 bg-white rounded-2xl border border-slate-200 shadow-xl p-6'>
              <h1 className='text-2xl font-black text-slate-900 mb-3 leading-tight'>{data?.title}</h1>
              <p className='text-slate-600 text-sm leading-relaxed mb-6'>{data?.description}</p>

              {/* Price */}
              <div className='mb-6'>
                <div className='flex items-baseline gap-3'>
                  <span className='text-4xl font-black text-slate-900'>₹{data?.amount}</span>
                  <span className='text-lg text-slate-400 line-through'>₹{originalPrice}</span>
                </div>
                <div className='inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 mt-2'>
                  Save ₹999 — Limited offer
                </div>
              </div>

              {/* Buy button */}
              <button
                disabled={isPending}
                onClick={purchaseHandler}
                className='w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white
                  font-bold text-base flex items-center justify-center gap-2 shadow-lg
                  shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5
                  transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                  disabled:translate-y-0 mb-3'
              >
                {isPending ? <Spinner /> : (
                  <>
                    <ShoppingCart className='w-5 h-5' />
                    Enroll Now
                  </>
                )}
              </button>

              <p className='text-center text-xs text-slate-400'>30-day money-back guarantee</p>

              {/* Trust badges */}
              <div className='mt-5 pt-5 border-t border-slate-100 space-y-2'>
                {['Secure payment via Stripe', 'Instant access after purchase', 'Cancel anytime'].map((t, i) => (
                  <div key={i} className='flex items-center gap-2 text-xs text-slate-500'>
                    <CheckCircle className='w-3.5 h-3.5 text-emerald-500' />
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
