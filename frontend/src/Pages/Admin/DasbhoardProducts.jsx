import { useCreateCouseHook, useGetCourseHook } from '@/hooks/course.hook'
import React, { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Users, IndianRupee, Layers, ChevronRight, Image } from 'lucide-react'

const DasbhoardProducts = () => {
  const { data, isLoading } = useGetCourseHook()
  const navigate = useNavigate()
  const { register, handleSubmit, reset: resetForm } = useForm()
  const { mutate, isPending } = useCreateCouseHook()
  const [open, setOpen] = useState(false)
  const [thumbPreview, setThumbPreview] = useState(null)

  const createCourseHandler = (formData) => {
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('description', formData.description)
    fd.append('amount', formData.amount)
    fd.append('thumbnail', formData.thumbnail[0])
    mutate(fd, {
      onSuccess: (res) => {
        toast.success(res.message)
        setOpen(false)
        resetForm()
        setThumbPreview(null)
      }
    })
  }

  return (
    <div className='min-h-screen bg-slate-50 p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-black text-slate-900'>Courses</h1>
          <p className='text-slate-500 mt-1'>{data?.courses?.length || 0} courses published</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className='flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all'>
            <Plus size={16} />
            Add Course
          </DialogTrigger>

          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle className='text-xl font-black'>Create New Course</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(createCourseHandler)} className='space-y-4 mt-2'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Course Title</label>
                <input {...register('title', { required: true })} placeholder='e.g. Advanced React Development'
                  className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none text-sm transition-all' />
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Description</label>
                <textarea {...register('description', { required: true })} placeholder='What will students learn?' rows={3}
                  className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none text-sm transition-all resize-none' />
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Price (₹)</label>
                <div className='relative'>
                  <IndianRupee className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                  <input type='number' {...register('amount', { required: true })} placeholder='999'
                    className='w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none text-sm transition-all' />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>Thumbnail</label>
                {thumbPreview && (
                  <img src={thumbPreview} alt='preview' className='w-full h-32 object-cover rounded-xl mb-2 border border-slate-200' />
                )}
                <label className='flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50 transition-all'>
                  <Image size={20} className='text-slate-400 mb-1' />
                  <span className='text-xs text-slate-500'>Click to upload image</span>
                  <input type='file' accept='image/*' className='hidden'
                    {...register('thumbnail', { required: true })}
                    onChange={(e) => {
                      register('thumbnail').onChange(e)
                      if (e.target.files[0]) setThumbPreview(URL.createObjectURL(e.target.files[0]))
                    }} />
                </label>
              </div>

              <button type='submit' disabled={isPending}
                className='w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:translate-y-0'>
                {isPending ? <><Spinner /> Creating...</> : 'Create Course'}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse'>
              <div className='h-44 bg-slate-200' />
              <div className='p-4 space-y-3'>
                <div className='h-4 bg-slate-200 rounded w-3/4' />
                <div className='h-3 bg-slate-100 rounded w-full' />
              </div>
            </div>
          ))}
        </div>
      ) : data?.courses?.length === 0 ? (
        <div className='bg-white rounded-2xl border border-slate-200 p-16 text-center'>
          <BookOpen className='w-16 h-16 text-slate-300 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-slate-800 mb-2'>No courses yet</h3>
          <p className='text-slate-500 text-sm'>Create your first course to get started</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {data?.courses?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/dashboard/CourseModule/${item._id}`)}
              className='group bg-white rounded-2xl overflow-hidden border border-slate-200
                hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer'
            >
              <div className='relative h-44 overflow-hidden bg-slate-100'>
                <img src={item.thumbnail} alt={item.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='flex items-center gap-1 bg-white text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg'>
                    Manage <ChevronRight size={12} />
                  </div>
                </div>
              </div>

              <div className='p-4'>
                <h3 className='font-bold text-slate-900 text-sm line-clamp-2 mb-3 group-hover:text-emerald-700 transition-colors'>
                  {item.title}
                </h3>

                <div className='flex items-center justify-between text-xs text-slate-500 mb-3'>
                  <span className='flex items-center gap-1'>
                    <Layers size={12} />
                    {item.modules?.length || 0} modules
                  </span>
                  <span className='flex items-center gap-1'>
                    <Users size={12} />
                    —
                  </span>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-slate-100'>
                  <span className='text-base font-black text-emerald-600'>₹{item.amount}</span>
                  <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium'>Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DasbhoardProducts
