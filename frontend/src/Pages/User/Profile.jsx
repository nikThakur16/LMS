import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/Store/user.store'
import { useUpdateProfileHook } from '@/hooks/User.hook'
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { Camera, User, Mail, ShieldCheck } from 'lucide-react'

const Profile = () => {
  const { user, setUser } = useUserStore()
  const { mutate, isPending } = useUpdateProfileHook()
  const { register, handleSubmit, reset } = useForm()
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName })
      setPreview(user.profilePhoto || null)
    }
  }, [user, reset])

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    if (data.profilePhoto?.[0]) formData.append('profilePhoto', data.profilePhoto[0])
    mutate(formData, { onSuccess: (res) => { if (res.user) setUser(res.user) } })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <div className='min-h-screen bg-[#09090b] px-6 py-12'>
      <div className='max-w-lg mx-auto'>
        <h1 className='text-2xl font-black text-white mb-8 tracking-tight'>Profile Settings</h1>

        <div className='surface-lg p-8'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-7'>
            {/* Avatar */}
            <div className='flex flex-col items-center gap-3'>
              <div className='relative'>
                <div className='w-24 h-24 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-white/8'>
                  {preview ? (
                    <img src={preview} alt='Profile' className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <User className='w-10 h-10 text-zinc-600' />
                    </div>
                  )}
                </div>
                <label className='absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 hover:bg-indigo-400
                  rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg'>
                  <Camera className='w-3.5 h-3.5 text-white' />
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    {...register('profilePhoto')}
                    onChange={(e) => {
                      register('profilePhoto').onChange(e)
                      handlePhotoChange(e)
                    }}
                  />
                </label>
              </div>
              <p className='text-xs text-zinc-600'>Click camera to change photo</p>
            </div>

            {/* Name field */}
            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600' />
                <input
                  {...register('fullName', { required: true })}
                  placeholder='Your full name'
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm'
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700' />
                <input
                  value={user?.email || ''}
                  disabled
                  className='input-dark w-full pl-10 pr-4 py-2.5 text-sm opacity-40 cursor-not-allowed'
                />
              </div>
              <p className='text-xs text-zinc-700 mt-1'>Email cannot be changed</p>
            </div>

            {/* Account type badge */}
            <div>
              <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>
                Account Type
              </label>
              <div className='flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 border border-white/8 rounded-xl'>
                <ShieldCheck className='w-4 h-4 text-zinc-600' />
                <span className={`text-sm font-semibold ${user?.admin ? 'text-amber-400' : 'text-indigo-400'}`}>
                  {user?.admin ? 'Administrator' : 'Student'}
                </span>
              </div>
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2'
            >
              {isPending ? <><Spinner /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
