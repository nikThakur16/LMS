import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/Store/user.store'
import { useUpdateProfileHook } from '@/hooks/User.hook'
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { Camera, User } from 'lucide-react'

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
    if (data.profilePhoto?.[0]) {
      formData.append('profilePhoto', data.profilePhoto[0])
    }

    mutate(formData, {
      onSuccess: (res) => {
        if (res.user) setUser(res.user)
      }
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-2xl mx-auto px-6 py-12'>
        <h1 className='text-3xl font-black text-slate-900 mb-8'>My Profile</h1>

        <div className='bg-white rounded-3xl shadow-lg border border-slate-100 p-8'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

            {/* Avatar */}
            <div className='flex flex-col items-center gap-4'>
              <div className='relative'>
                <div className='w-28 h-28 rounded-full overflow-hidden bg-slate-200 ring-4 ring-slate-100'>
                  {preview ? (
                    <img src={preview} alt='Profile' className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <User className='w-12 h-12 text-slate-400' />
                    </div>
                  )}
                </div>
                <label className='absolute bottom-0 right-0 w-9 h-9 bg-slate-900 hover:bg-slate-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors'>
                  <Camera className='w-4 h-4 text-white' />
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
              <p className='text-sm text-slate-500'>Click the camera icon to change photo</p>
            </div>

            {/* Fields */}
            <div className='space-y-5'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Full Name</label>
                <input
                  {...register('fullName', { required: true })}
                  placeholder='Your full name'
                  className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-100 focus:outline-none transition-all'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Email</label>
                <input
                  value={user?.email || ''}
                  disabled
                  className='w-full px-4 py-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed'
                />
                <p className='text-xs text-slate-400 mt-1'>Email cannot be changed</p>
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Account Type</label>
                <div className='px-4 py-3 border-2 border-slate-100 rounded-xl bg-slate-50'>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${user?.admin ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {user?.admin ? 'Admin' : 'Student'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type='submit'
              disabled={isPending}
              className='w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
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
