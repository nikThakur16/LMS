import { Spinner } from '@/components/ui/spinner'
import { useRegisterHook } from '@/hooks/User.hook'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, BookOpen, CheckCircle } from 'lucide-react'

const Register = () => {
  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useRegisterHook()
  const [showPass, setShowPass] = useState(false)

  const perks = [
    'Access 50+ expert-led courses',
    'AI-generated quizzes per module',
    'Progress tracking & certificates',
    'Community discussions',
  ]

  return (
    <div className='min-h-screen flex bg-slate-50'>
      {/* Left panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-16 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 right-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl' />
          <div className='absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl' />
        </div>
        <div className='relative'>
          <div className='w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-8'>
            <BookOpen className='w-10 h-10 text-emerald-400' />
          </div>
          <h2 className='text-3xl font-black text-white mb-3'>Start Learning Today</h2>
          <p className='text-slate-400 mb-10 max-w-sm'>
            Join thousands of students upgrading their skills on EduSmart
          </p>
          <div className='space-y-4'>
            {perks.map((p, i) => (
              <div key={i} className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0'>
                  <CheckCircle className='w-3.5 h-3.5 text-emerald-400' />
                </div>
                <span className='text-slate-300 text-sm'>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md'>
          {/* Logo (mobile) */}
          <div className='flex items-center gap-3 mb-10 lg:hidden'>
            <div className='w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center'>
              <BookOpen className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-black text-slate-900'>EduSmart</span>
          </div>

          <h1 className='text-3xl font-black text-slate-900 mb-2'>Create account</h1>
          <p className='text-slate-500 mb-8'>Join EduSmart and start learning for free</p>

          <form onSubmit={handleSubmit((d) => mutate(d))} className='space-y-5'>
            {/* Full Name */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Full Name</label>
              <div className='relative'>
                <User className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input
                  type='text'
                  placeholder='John Doe'
                  {...register('fullName', { required: true })}
                  className='w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl
                    focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none
                    transition-all text-sm bg-white'
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input
                  type='email'
                  placeholder='you@example.com'
                  {...register('email', { required: true })}
                  className='w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl
                    focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none
                    transition-all text-sm bg-white'
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder='Min. 8 characters'
                  {...register('password', { required: true })}
                  className='w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl
                    focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none
                    transition-all text-sm bg-white'
                />
                <button
                  type='button'
                  onClick={() => setShowPass(!showPass)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white
                font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
                hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60
                disabled:translate-y-0 flex items-center justify-center'
            >
              {isPending ? <Spinner /> : 'Create Account'}
            </button>
          </form>

          <p className='text-sm text-center text-slate-500 mt-8'>
            Already have an account?{' '}
            <Link to='/login' className='text-emerald-600 font-semibold hover:text-emerald-500 transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
