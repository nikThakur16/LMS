import React from 'react'
import { Link } from 'react-router-dom'
import { XCircle, Home, ArrowLeft } from 'lucide-react'

const Cancel = () => {
  return (
    <div className='min-h-screen bg-[#09090b] flex items-center justify-center px-6'>
      <div className='max-w-sm w-full surface-lg p-10 text-center'>
        <div className='w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-500/20'>
          <XCircle className='w-7 h-7 text-red-400' />
        </div>
        <h1 className='text-xl font-black text-white mb-2'>Payment Cancelled</h1>
        <p className='text-zinc-600 text-sm mb-8 leading-relaxed'>
          Your payment was not completed. No charges were made.
        </p>

        <div className='flex flex-col gap-2'>
          <Link to='/'>
            <button className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2'>
              <Home className='w-4 h-4' />
              Browse Courses
            </button>
          </Link>
          <Link to='/YourCourse'>
            <button className='btn-ghost w-full py-2.5 text-sm flex items-center justify-center gap-2'>
              <ArrowLeft className='w-4 h-4' />
              My Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cancel
