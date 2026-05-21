import { Spinner } from '@/components/ui/spinner'
import { useLoginHook } from '@/hooks/User.hook'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { mutate, isPending } = useLoginHook()
  const [showPass, setShowPass] = useState(false)

  return (
    <div className='min-h-screen flex bg-slate-50'>
      {/* Left panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-16 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 left-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl' />
        </div>
        <div className='relative text-center'>
          <div className='w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8'>
            <BookOpen className='w-10 h-10 text-emerald-400' />
          </div>
          <h2 className='text-4xl font-black text-white mb-4 tracking-tight'>EduSmart</h2>
          <p className='text-slate-400 text-lg max-w-sm'>
            Accelerate your career with expert-led courses and AI-powered learning
          </p>
          <div className='mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto'>
            {[['50+', 'Courses'], ['2K+', 'Students'], ['94%', 'Completion'], ['4.8★', 'Rating']].map(([val, lbl]) => (
              <div key={lbl} className='bg-white/5 border border-white/10 rounded-2xl p-4 text-center'>
                <p className='text-xl font-black text-emerald-400'>{val}</p>
                <p className='text-xs text-slate-500 mt-1'>{lbl}</p>
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

          <h1 className='text-3xl font-black text-slate-900 mb-2'>Welcome back</h1>
          <p className='text-slate-500 mb-8'>Sign in to continue learning</p>

          <form onSubmit={handleSubmit((d) => mutate(d))} className='space-y-5'>
            {/* Email */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400' size={18} />
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
                  placeholder='••••••••'
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
              {isPending ? <Spinner /> : 'Sign In'}
            </button>
          </form>

          <p className='text-sm text-center text-slate-500 mt-8'>
            Don't have an account?{' '}
            <Link to='/register' className='text-emerald-600 font-semibold hover:text-emerald-500 transition-colors'>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
