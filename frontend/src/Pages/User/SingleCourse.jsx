import { Spinner } from '@/components/ui/spinner'
import { useGetSingleCourseHook } from '@/hooks/course.hook'
import { usePayment } from '@/hooks/payment.hook'
import { useCreateReview, useGetReviews } from '@/hooks/review.hook'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ArrowLeft, BookOpen, Users, Star, CheckCircle2,
  Play, Zap, Lock, ChevronDown, ChevronUp, MessageSquare, Send
} from 'lucide-react'

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className='flex gap-1'>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type='button'
        disabled={readonly}
        onClick={() => onChange && onChange(n)}
        className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
      >
        <Star
          className='w-5 h-5'
          fill={n <= value ? '#f59e0b' : 'none'}
          color={n <= value ? '#f59e0b' : 'var(--app-text-4)'}
        />
      </button>
    ))}
  </div>
)

const SingleCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetSingleCourseHook(id)
  const { mutate, isPending } = usePayment()
  const [showAllModules, setShowAllModules] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  const { data: reviewsData } = useGetReviews(id)
  const { mutate: submitReview, isPending: isSubmitting } = useCreateReview()

  const reviews = reviewsData?.reviews || []
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const purchaseHandler = () => {
    mutate({ products: { _id: data._id, name: data.title, price: data.amount, image: data.thumbnail } })
  }

  const submitReviewHandler = (e) => {
    e.preventDefault()
    if (!rating) return
    submitReview(
      { courseId: id, rating, comment },
      {
        onSuccess: () => {
          setRating(0); setComment(''); setShowReviewForm(false)
        }
      }
    )
  }

  const features = [
    'Full lifetime access', 'Access on all devices',
    'AI-generated quizzes', 'Certificate of completion',
    'Community discussions', 'Expert-curated content',
  ]

  if (isLoading) {
    return (
      <div className='min-h-screen p-8' style={{ background: 'var(--app-bg)' }}>
        <div className='max-w-6xl mx-auto animate-pulse space-y-6'>
          <div className='h-5 w-32 rounded-lg' style={{ background: 'var(--app-surface-2)' }} />
          <div className='grid md:grid-cols-5 gap-8'>
            <div className='md:col-span-3 space-y-4'>
              <div className='h-72 rounded-2xl' style={{ background: 'var(--app-surface-2)' }} />
              <div className='h-5 rounded-lg w-3/4' style={{ background: 'var(--app-surface-2)' }} />
            </div>
            <div className='md:col-span-2'>
              <div className='h-80 rounded-2xl' style={{ background: 'var(--app-surface-2)' }} />
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
    <div className='min-h-screen' style={{ background: 'var(--app-bg)' }}>
      <div className='max-w-6xl mx-auto px-6 pt-8 pb-20'>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-1.5 text-sm transition-colors mb-8'
          style={{ color: 'var(--app-text-4)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--app-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--app-text-4)'}
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </button>

        <div className='grid md:grid-cols-5 gap-10'>
          {/* Left column */}
          <div className='md:col-span-3 space-y-5'>
            {/* Course image */}
            <div className='relative rounded-2xl overflow-hidden border'
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
              <img
                src={data?.thumbnail}
                alt={data?.title}
                className='w-full h-64 object-cover opacity-90'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-14 h-14 glass rounded-full flex items-center justify-center
                  hover:bg-white/10 transition-colors cursor-pointer border border-white/20'>
                  <Play className='w-6 h-6 text-white ml-0.5' fill='white' />
                </div>
              </div>
              {avgRating && (
                <div className='absolute top-3 right-3 flex items-center gap-1.5
                  bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10'>
                  <Star className='w-3.5 h-3.5 text-amber-400 fill-amber-400' />
                  <span className='text-sm font-bold text-white'>{avgRating}</span>
                  <span className='text-xs text-white/60'>({reviews.length})</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-3'>
              {[
                { icon: BookOpen, label: 'Modules', value: moduleCount },
                { icon: Users,    label: 'Students', value: '1.2k+' },
                { icon: Star,     label: 'Rating',   value: avgRating || '4.8' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className='surface p-4 text-center'>
                  <Icon className='w-4 h-4 text-indigo-400 mx-auto mb-1.5' />
                  <p className='text-lg font-black' style={{ color: 'var(--app-text)' }}>{value}</p>
                  <p className='text-xs font-medium' style={{ color: 'var(--app-text-4)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* What's included */}
            <div className='surface-lg p-5'>
              <h3 className='font-semibold mb-4 flex items-center gap-2 text-sm' style={{ color: 'var(--app-text)' }}>
                <Zap className='w-4 h-4 text-indigo-400' />
                What's included
              </h3>
              <div className='grid grid-cols-2 gap-2.5'>
                {features.map((f) => (
                  <div key={f} className='flex items-center gap-2 text-sm' style={{ color: 'var(--app-text-2)' }}>
                    <CheckCircle2 className='w-3.5 h-3.5 text-indigo-400 flex-shrink-0' />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Course content */}
            {moduleCount > 0 && (
              <div className='surface-lg p-5'>
                <h3 className='font-semibold mb-4 flex items-center gap-2 text-sm' style={{ color: 'var(--app-text)' }}>
                  <BookOpen className='w-4 h-4 text-indigo-400' />
                  Course Content
                  <span className='font-normal' style={{ color: 'var(--app-text-4)' }}>({moduleCount} modules)</span>
                </h3>
                <div className='space-y-2'>
                  {visibleModules?.map((m, i) => (
                    <div key={m._id || i}
                      className='flex items-center gap-3 py-2.5 px-3 rounded-xl border'
                      style={{ background: 'var(--app-surface-2)', borderColor: 'var(--app-border)' }}>
                      <div className='w-6 h-6 bg-indigo-500/15 rounded-lg flex items-center justify-center
                        text-xs font-bold text-indigo-400 flex-shrink-0'>
                        {i + 1}
                      </div>
                      <span className='text-sm line-clamp-1 flex-1' style={{ color: 'var(--app-text-2)' }}>
                        {m.title}
                      </span>
                      <Lock className='w-3.5 h-3.5 flex-shrink-0' style={{ color: 'var(--app-text-4)' }} />
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

            {/* Reviews section — enrolled users only */}
            {data?.isPurchased && (
              <div className='surface-lg p-5'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-semibold flex items-center gap-2 text-sm' style={{ color: 'var(--app-text)' }}>
                    <MessageSquare className='w-4 h-4 text-indigo-400' />
                    Reviews
                    {reviews.length > 0 && (
                      <span className='font-normal ml-1' style={{ color: 'var(--app-text-4)' }}>
                        ({reviews.length})
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className='text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors'
                  >
                    {showReviewForm ? 'Cancel' : '+ Write a Review'}
                  </button>
                </div>

                {/* Review form */}
                {showReviewForm && (
                  <form onSubmit={submitReviewHandler}
                    className='p-4 rounded-xl border mb-5 space-y-3'
                    style={{ background: 'var(--app-surface-2)', borderColor: 'var(--app-border)' }}>
                    <div>
                      <p className='text-xs font-medium mb-2' style={{ color: 'var(--app-text-2)' }}>Your rating</p>
                      <div className='flex gap-1'>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n} type='button'
                            onClick={() => setRating(n)}
                            onMouseEnter={() => setHoverRating(n)}
                            onMouseLeave={() => setHoverRating(0)}
                            className='transition-transform hover:scale-110'
                          >
                            <Star
                              className='w-6 h-6'
                              fill={n <= (hoverRating || rating) ? '#f59e0b' : 'none'}
                              color={n <= (hoverRating || rating) ? '#f59e0b' : 'var(--app-text-4)'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder='Share your experience with this course...'
                      rows={3}
                      className='input-dark w-full p-3 text-sm resize-none'
                    />
                    <button
                      type='submit'
                      disabled={!rating || isSubmitting}
                      className='btn-primary px-4 py-2 text-sm flex items-center gap-1.5'
                    >
                      {isSubmitting ? <Spinner /> : <><Send className='w-3.5 h-3.5' /> Submit Review</>}
                    </button>
                  </form>
                )}

                {/* Reviews list */}
                {reviews.length === 0 ? (
                  <div className='py-8 text-center'>
                    <MessageSquare className='w-8 h-8 mx-auto mb-2' style={{ color: 'var(--app-text-4)' }} />
                    <p className='text-sm' style={{ color: 'var(--app-text-4)' }}>
                      No reviews yet — be the first!
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {reviews.map((r, i) => (
                      <div key={r._id || i} className='flex gap-3'>
                        <Avatar className='w-8 h-8 flex-shrink-0 mt-0.5'>
                          <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                            {r.userId?.fullName?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-xs font-semibold' style={{ color: 'var(--app-text)' }}>
                              {r.userId?.fullName || 'Anonymous'}
                            </span>
                            <StarRating value={r.rating} readonly />
                          </div>
                          {r.comment && (
                            <p className='text-sm leading-relaxed' style={{ color: 'var(--app-text-2)' }}>
                              {r.comment}
                            </p>
                          )}
                          <p className='text-xs mt-1' style={{ color: 'var(--app-text-4)' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Purchase card */}
          <div className='md:col-span-2'>
            <div className='sticky top-20 surface-lg p-6 glow-indigo-sm'>
              <h1 className='text-xl font-black mb-2 leading-tight' style={{ color: 'var(--app-text)' }}>
                {data?.title}
              </h1>
              <p className='text-sm leading-relaxed mb-5' style={{ color: 'var(--app-text-3)' }}>
                {data?.description}
              </p>

              {/* Price */}
              <div className='mb-5'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-black' style={{ color: 'var(--app-text)' }}>₹{data?.amount}</span>
                  <span className='text-sm line-through' style={{ color: 'var(--app-text-4)' }}>₹{originalPrice}</span>
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

              <p className='text-center text-xs mb-5' style={{ color: 'var(--app-text-4)' }}>
                30-day money-back guarantee
              </p>

              <div className='space-y-2 pt-4 border-t' style={{ borderTopColor: 'var(--app-border)' }}>
                {['Secure payment via Stripe', 'Instant access after purchase', 'Cancel anytime'].map((t) => (
                  <div key={t} className='flex items-center gap-2 text-xs' style={{ color: 'var(--app-text-4)' }}>
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
