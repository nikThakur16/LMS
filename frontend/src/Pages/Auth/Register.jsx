import { Spinner } from '@/components/ui/spinner'
import { useRegisterHook } from '@/hooks/User.hook'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, CheckCircle2 } from 'lucide-react'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { mutate, isPending } = useRegisterHook()
  const [showPass, setShowPass] = useState(false)

  const perks = [
    'Access 50+ expert-led courses',
    'AI-generated quizzes per module',
    'Track your learning progress',
    'Earn completion certificates',
    'Module discussion & comments',
    'Lifetime access after purchase',
  ]

  return (
    <div className='min-h-screen flex' style={{ background: 'var(--app-bg)' }}>
      {/* Left panel — always dark hero */}
      <div className='hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14 bg-[#09090b]'>
        <div className='absolute inset-0 mesh-bg' />
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent' />

        <div className='relative flex items-center gap-2.5'>
          <div className='w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center'>
            <GraduationCap className='w-5 h-5 text-white' />
          </div>
          <span className='text-lg font-bold text-white'>EduSmart</span>
        </div>

        <div className='relative'>
          <div className='inline-flex items-center gap-2 badge-indigo mb-6'>
            <span className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse' />
            Join 2,000+ learners today
          </div>
          <h2 className='text-4xl lg:text-5xl font-black text-white leading-tight mb-4'>
            Start learning<br />
            <span className='gradient-text'>the smart way</span>
          </h2>
          <p className='text-zinc-400 text-lg leading-relaxed max-w-md mb-10'>
            Everything you need to level up your skills, in one beautifully designed platform.
          </p>
          <div className='space-y-3'>
            {perks.map((perk) => (
              <div key={perk} className='flex items-center gap-3'>
                <CheckCircle2 className='w-4 h-4 text-indigo-400 flex-shrink-0' />
                <span className='text-zinc-300 text-sm font-medium'>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='relative surface p-5 max-w-md'>
          <p className='text-zinc-300 text-sm leading-relaxed italic'>
            "The best investment I made was signing up for EduSmart. The structured courses and quizzes kept me on track."
          </p>
          <p className='text-zinc-500 text-xs mt-3 font-medium'>— Rahul K., Backend Engineer</p>
        </div>
      </div>

      {/* Right panel — theme-aware */}
      <div className='flex-1 flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-sm'>
          <div className='flex items-center gap-2.5 mb-10 lg:hidden'>
            <div className='w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-4 h-4 text-white' />
            </div>
            <span className='text-base font-bold' style={{ color: 'var(--app-text)' }}>EduSmart</span>
          </div>

          <h1 className='text-2xl font-black mb-1 tracking-tight' style={{ color: 'var(--app-text)' }}>
            Create your account
          </h1>
          <p className='text-sm mb-8' style={{ color: 'var(--app-text-3)' }}>Free to join, start learning today</p>

          <form onSubmit={handleSubmit((d) => mutate(d))} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                style={{ color: 'var(--app-text-2)' }}>
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4' style={{ color: 'var(--app-text-4)' }} />
                <input
                  type='text'
                  placeholder='John Doe'
                  {...register('fullName', { required: 'Full name is required' })}
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm'
                />
              </div>
              {errors.fullName && <p className='text-xs text-red-400 mt-1'>{errors.fullName.message}</p>}
            </div>

            <div>
              <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                style={{ color: 'var(--app-text-2)' }}>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4' style={{ color: 'var(--app-text-4)' }} />
                <input
                  type='email'
                  placeholder='you@example.com'
                  {...register('email', { required: 'Email is required' })}
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm'
                />
              </div>
              {errors.email && <p className='text-xs text-red-400 mt-1'>{errors.email.message}</p>}
            </div>

            <div>
              <label className='block text-xs font-semibold mb-1.5 uppercase tracking-wider'
                style={{ color: 'var(--app-text-2)' }}>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4' style={{ color: 'var(--app-text-4)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder='Min. 6 characters'
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  className='input-dark w-full pl-10 pr-11 py-2.5 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowPass(!showPass)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors'
                  style={{ color: 'var(--app-text-4)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className='text-xs text-red-400 mt-1'>{errors.password.message}</p>}
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='btn-primary w-full py-2.5 text-sm mt-2 flex items-center justify-center gap-2'
            >
              {isPending ? <Spinner /> : 'Create Account'}
            </button>
          </form>

          <p className='text-sm text-center mt-6' style={{ color: 'var(--app-text-4)' }}>
            Already have an account?{' '}
            <Link to='/login' className='text-indigo-400 font-semibold hover:text-indigo-300 transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
