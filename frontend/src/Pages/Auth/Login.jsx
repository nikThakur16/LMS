import { Spinner } from '@/components/ui/spinner'
import { useLoginHook } from '@/hooks/User.hook'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, GraduationCap, Star, Users, BookOpen, TrendingUp } from 'lucide-react'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { mutate, isPending } = useLoginHook()
  const [showPass, setShowPass] = useState(false)

  const stats = [
    { icon: BookOpen, value: '50+', label: 'Expert Courses' },
    { icon: Users,    value: '2K+', label: 'Active Learners' },
    { icon: TrendingUp, value: '94%', label: 'Completion Rate' },
    { icon: Star,     value: '4.8', label: 'Avg Rating' },
  ]

  return (
    <div className='min-h-screen flex bg-[#09090b]'>
      {/* Left panel */}
      <div className='hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14'>
        {/* Gradient mesh */}
        <div className='absolute inset-0 mesh-bg' />
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent' />

        {/* Brand */}
        <div className='relative flex items-center gap-2.5'>
          <div className='w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center'>
            <GraduationCap className='w-5 h-5 text-white' />
          </div>
          <span className='text-lg font-bold text-white'>EduSmart</span>
        </div>

        {/* Center content */}
        <div className='relative'>
          <div className='inline-flex items-center gap-2 badge-indigo mb-6'>
            <span className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse' />
            AI-Powered Learning Platform
          </div>
          <h2 className='text-4xl lg:text-5xl font-black text-white leading-tight mb-4'>
            Accelerate your<br />
            <span className='gradient-text'>career growth</span>
          </h2>
          <p className='text-zinc-400 text-lg leading-relaxed max-w-md'>
            Master in-demand skills with expert-led courses, AI-generated quizzes, and a community of driven learners.
          </p>

          <div className='grid grid-cols-2 gap-3 mt-10 max-w-sm'>
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className='surface p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Icon className='w-4 h-4 text-indigo-400' />
                  <span className='text-xl font-black text-white'>{value}</span>
                </div>
                <p className='text-xs text-zinc-500 font-medium'>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className='relative surface p-5 max-w-md'>
          <p className='text-zinc-300 text-sm leading-relaxed italic'>
            "EduSmart helped me land my first developer job in 3 months. The AI quizzes made learning stick."
          </p>
          <p className='text-zinc-500 text-xs mt-3 font-medium'>— Priya S., Full Stack Developer</p>
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 relative'>
        <div className='absolute inset-0 bg-zinc-950/50' />
        <div className='relative w-full max-w-sm'>
          {/* Mobile logo */}
          <div className='flex items-center gap-2.5 mb-10 lg:hidden'>
            <div className='w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-4.5 h-4.5 text-white' />
            </div>
            <span className='text-base font-bold text-white'>EduSmart</span>
          </div>

          <h1 className='text-2xl font-black text-white mb-1 tracking-tight'>Welcome back</h1>
          <p className='text-zinc-500 text-sm mb-8'>Sign in to continue learning</p>

          <form onSubmit={handleSubmit((d) => mutate(d))} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600' />
                <input
                  type='email'
                  placeholder='you@example.com'
                  {...register('email', { required: 'Email is required' })}
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm'
                />
              </div>
              {errors.email && (
                <p className='text-xs text-red-400 mt-1'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600' />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder='••••••••'
                  {...register('password', { required: 'Password is required' })}
                  className='input-dark w-full pl-10 pr-11 py-2.5 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowPass(!showPass)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors'
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-xs text-red-400 mt-1'>{errors.password.message}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='btn-primary w-full py-2.5 text-sm mt-2 flex items-center justify-center gap-2'
            >
              {isPending ? <Spinner /> : 'Sign In'}
            </button>
          </form>

          <p className='text-sm text-center text-zinc-600 mt-6'>
            Don't have an account?{' '}
            <Link to='/register' className='text-indigo-400 font-semibold hover:text-indigo-300 transition-colors'>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
