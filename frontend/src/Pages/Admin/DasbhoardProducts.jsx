import { useCreateCouseHook, useGetCourseHook } from '@/hooks/course.hook'
import React, { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Layers, ChevronRight, Image, IndianRupee, X } from 'lucide-react'

const DasbhoardProducts = () => {
  const { data, isLoading } = useGetCourseHook()
  const navigate = useNavigate()
  const { register, handleSubmit, reset: resetForm } = useForm()
  const { mutate, isPending } = useCreateCouseHook()
  const [open, setOpen] = useState(false)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [learnPoints, setLearnPoints] = useState(['', '', ''])
  const [reqPoints, setReqPoints]     = useState([''])

  const updatePoint = (setter, arr, idx, val) => {
    const next = [...arr]; next[idx] = val; setter(next)
  }
  const addPoint    = (setter, arr) => setter([...arr, ''])
  const removePoint = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx))

  const createCourseHandler = (formData) => {
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('description', formData.description)
    fd.append('amount', formData.amount)
    fd.append('thumbnail', formData.thumbnail[0])
    fd.append('level', formData.level || 'Beginner')
    fd.append('language', formData.language || 'English')
    if (formData.totalDuration) fd.append('totalDuration', formData.totalDuration)
    learnPoints.filter(Boolean).forEach(p => fd.append('whatYouLearn', p))
    reqPoints.filter(Boolean).forEach(p => fd.append('requirements', p))

    mutate(fd, {
      onSuccess: (res) => {
        toast.success(res.message)
        setOpen(false)
        resetForm()
        setThumbPreview(null)
        setLearnPoints(['', '', ''])
        setReqPoints([''])
      }
    })
  }

  return (
    <div className='min-h-screen bg-[#09090b] p-7'>
      {/* Header */}
      <div className='flex items-center justify-between mb-7'>
        <div>
          <h1 className='text-xl font-black text-white'>Courses</h1>
          <p className='text-zinc-600 text-sm mt-0.5'>{data?.courses?.length || 0} courses published</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className='btn-primary flex items-center gap-2 px-4 py-2.5 text-sm'>
              <Plus size={15} />
              Add Course
            </button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-lg bg-zinc-900 border border-white/8 text-white shadow-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-base font-bold text-white'>Create New Course</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(createCourseHandler)} className='space-y-4 mt-1'>
              <div>
                <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Course Title</label>
                <input
                  {...register('title', { required: true })}
                  placeholder='e.g. Advanced React Development'
                  className='input-dark w-full px-3 py-2.5 text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Description</label>
                <textarea
                  {...register('description', { required: true })}
                  placeholder='What will students learn?'
                  rows={3}
                  className='input-dark w-full px-3 py-2.5 text-sm resize-none'
                />
              </div>

              {/* Level + Language row */}
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Level</label>
                  <select
                    {...register('level')}
                    className='input-dark w-full px-3 py-2.5 text-sm'
                  >
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Advanced'>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Language</label>
                  <input
                    {...register('language')}
                    defaultValue='English'
                    className='input-dark w-full px-3 py-2.5 text-sm'
                  />
                </div>
              </div>

              {/* Price + Duration row */}
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Price (₹)</label>
                  <div className='relative'>
                    <IndianRupee className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500' size={14} />
                    <input
                      type='number'
                      {...register('amount', { required: true })}
                      placeholder='999'
                      className='input-dark w-full pl-9 py-2.5 text-sm'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Duration</label>
                  <input
                    {...register('totalDuration')}
                    placeholder='e.g. 12 hours'
                    className='input-dark w-full px-3 py-2.5 text-sm'
                  />
                </div>
              </div>

              {/* What you'll learn */}
              <div>
                <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>What You'll Learn</label>
                <div className='space-y-2'>
                  {learnPoints.map((val, idx) => (
                    <div key={idx} className='flex gap-2'>
                      <input
                        value={val}
                        onChange={(e) => updatePoint(setLearnPoints, learnPoints, idx, e.target.value)}
                        placeholder={`Learning outcome ${idx + 1}`}
                        className='input-dark flex-1 px-3 py-2 text-sm'
                      />
                      {learnPoints.length > 1 && (
                        <button type='button' onClick={() => removePoint(setLearnPoints, learnPoints, idx)}
                          className='w-8 h-9 flex items-center justify-center text-zinc-600 hover:text-red-400 transition-colors'>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type='button' onClick={() => addPoint(setLearnPoints, learnPoints)}
                    className='text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium'>
                    + Add outcome
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Requirements</label>
                <div className='space-y-2'>
                  {reqPoints.map((val, idx) => (
                    <div key={idx} className='flex gap-2'>
                      <input
                        value={val}
                        onChange={(e) => updatePoint(setReqPoints, reqPoints, idx, e.target.value)}
                        placeholder={`Prerequisite ${idx + 1}`}
                        className='input-dark flex-1 px-3 py-2 text-sm'
                      />
                      {reqPoints.length > 1 && (
                        <button type='button' onClick={() => removePoint(setReqPoints, reqPoints, idx)}
                          className='w-8 h-9 flex items-center justify-center text-zinc-600 hover:text-red-400 transition-colors'>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type='button' onClick={() => addPoint(setReqPoints, reqPoints)}
                    className='text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium'>
                    + Add requirement
                  </button>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Thumbnail</label>
                {thumbPreview && (
                  <img src={thumbPreview} alt='preview' className='w-full h-28 object-cover rounded-xl mb-2 border border-white/8' />
                )}
                <label className='flex flex-col items-center justify-center w-full h-20 border border-dashed border-white/15 hover:border-indigo-500/50 rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-indigo-500/5 transition-all'>
                  <Image size={18} className='text-zinc-600 mb-1' />
                  <span className='text-xs text-zinc-600'>Click to upload image</span>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    {...register('thumbnail', { required: true })}
                    onChange={(e) => {
                      register('thumbnail').onChange(e)
                      if (e.target.files[0]) setThumbPreview(URL.createObjectURL(e.target.files[0]))
                    }}
                  />
                </label>
              </div>

              <button
                type='submit'
                disabled={isPending}
                className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50'
              >
                {isPending ? <><Spinner /> Creating...</> : 'Create Course'}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='surface-lg overflow-hidden animate-pulse'>
              <div className='h-40 bg-zinc-800' />
              <div className='p-4 space-y-2.5'>
                <div className='h-3.5 bg-zinc-800 rounded w-3/4' />
                <div className='h-3 bg-zinc-800/60 rounded w-full' />
              </div>
            </div>
          ))}
        </div>
      ) : data?.courses?.length === 0 ? (
        <div className='surface-lg p-16 text-center'>
          <BookOpen className='w-12 h-12 text-zinc-700 mx-auto mb-4' />
          <h3 className='text-base font-bold text-white mb-1'>No courses yet</h3>
          <p className='text-zinc-600 text-sm'>Create your first course to get started</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {data?.courses?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/dashboard/CourseModule/${item._id}`)}
              className='group surface-lg overflow-hidden hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
            >
              <div className='relative h-40 overflow-hidden bg-zinc-800'>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                {item.level && (
                  <div className='absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md bg-black/60 text-white border border-white/10'>
                    {item.level}
                  </div>
                )}
                <div className='absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='flex items-center gap-1 bg-white/10 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/20'>
                    Manage <ChevronRight size={11} />
                  </div>
                </div>
              </div>

              <div className='p-4'>
                <h3 className='font-semibold text-white text-sm line-clamp-2 mb-3 group-hover:text-indigo-300 transition-colors'>
                  {item.title}
                </h3>

                <div className='flex items-center justify-between text-xs text-zinc-600 mb-3'>
                  <span className='flex items-center gap-1.5'>
                    <Layers size={11} />
                    {item.modules?.length || 0} modules
                  </span>
                  <span className='text-xs text-zinc-700 bg-zinc-800 px-2 py-0.5 rounded-lg font-medium border border-white/5'>Active</span>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-white/5'>
                  <span className='text-sm font-black text-indigo-400'>₹{item.amount?.toLocaleString('en-IN')}</span>
                  {item.totalDuration && (
                    <span className='text-xs text-zinc-600'>{item.totalDuration}</span>
                  )}
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
