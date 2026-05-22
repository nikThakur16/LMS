import { useCheckoutSuccess } from '@/hooks/payment.hook'
import React, { useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight, BookOpen } from 'lucide-react'

const PaymenSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate, isSuccess } = useCheckoutSuccess()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) mutate(sessionId)
  }, [searchParams, mutate])

  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => navigate('/YourCourse'), 5000)
      return () => clearTimeout(t)
    }
  }, [isSuccess, navigate])

  return (
    <div className='min-h-screen bg-[#09090b] flex items-center justify-center px-6 mesh-bg'>
      <div className='max-w-md w-full surface-lg p-10 text-center'>
        <div className='w-16 h-16 bg-green-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/25'>
          <CheckCircle2 className='w-8 h-8 text-green-400' />
        </div>

        <h1 className='text-2xl font-black text-white mb-2'>Payment Successful!</h1>
        <p className='text-zinc-500 text-sm mb-8 leading-relaxed'>
          Your course access is now active. Start learning right away.
        </p>

        <div className='space-y-3 mb-8'>
          <div className='flex items-center gap-3 p-3.5 bg-green-500/8 rounded-xl border border-green-500/15 text-sm text-green-400'>
            <CheckCircle2 className='w-4 h-4 flex-shrink-0' />
            Course unlocked successfully
          </div>
          <div className='flex items-center gap-3 p-3.5 bg-indigo-500/8 rounded-xl border border-indigo-500/15 text-sm text-indigo-400'>
            <ArrowRight className='w-4 h-4 flex-shrink-0' />
            Redirecting to My Courses in 5s...
          </div>
        </div>

        <div className='flex gap-3'>
          <Link to='/YourCourse' className='flex-1'>
            <button className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2'>
              <BookOpen className='w-4 h-4' />
              My Courses
            </button>
          </Link>
          <Link to='/' className='flex-1'>
            <button className='btn-ghost w-full py-2.5 text-sm'>
              Browse More
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymenSuccess
