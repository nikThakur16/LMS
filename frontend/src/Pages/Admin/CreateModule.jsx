import { useGetSingleCourseHook } from '@/hooks/course.hook'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { useCreateModule } from '@/hooks/module.hook'
import { Spinner } from '@/components/ui/spinner'
import { Plus, PlayCircle, Layers, Video } from 'lucide-react'

const CreateModule = () => {
  const { id } = useParams()
  const { data } = useGetSingleCourseHook(id)
  const [openModule, setOpenModule] = useState(false)
  const [videoName, setVideoName] = useState(null)

  const { register, handleSubmit, reset } = useForm()
  const { mutate, isPending } = useCreateModule()

  const moduleFormHandler = (formData) => {
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('video', formData.video[0])
    fd.append('courseId', id)

    mutate(fd, {
      onSuccess: () => {
        setOpenModule(false)
        reset()
        setVideoName(null)
      }
    })
  }

  return (
    <div className='min-h-screen bg-[#09090b] p-7'>
      {/* Course Header */}
      <div className='mb-7'>
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-xl font-black text-white mb-1'>{data?.title || 'Course Modules'}</h1>
            <div className='flex items-center gap-2 text-sm text-zinc-600'>
              <Layers size={13} />
              <span>{data?.modules?.length || 0} modules</span>
            </div>
          </div>

          <Dialog open={openModule} onOpenChange={setOpenModule}>
            <DialogTrigger asChild>
              <button className='btn-primary flex items-center gap-2 px-4 py-2.5 text-sm'>
                <Plus size={15} />
                Add Module
              </button>
            </DialogTrigger>

            <DialogContent className='max-w-md bg-zinc-900 border border-white/8 text-white shadow-2xl'>
              <DialogHeader>
                <DialogTitle className='text-base font-bold text-white'>New Module</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(moduleFormHandler)} className='space-y-4 mt-1'>
                <div>
                  <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Module Title</label>
                  <input
                    type='text'
                    placeholder='e.g. Introduction to React Hooks'
                    className='input-dark w-full'
                    {...register('title', { required: true })}
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider'>Video File</label>
                  <label className='flex flex-col items-center justify-center w-full h-24 border border-dashed border-white/15 hover:border-indigo-500/50 rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-indigo-500/5 transition-all'>
                    <Video size={20} className='text-zinc-600 mb-1.5' />
                    {videoName
                      ? <span className='text-xs text-indigo-400 font-medium px-4 text-center line-clamp-1'>{videoName}</span>
                      : <span className='text-xs text-zinc-600'>Click to upload video</span>
                    }
                    <input
                      type='file'
                      accept='video/*'
                      className='hidden'
                      {...register('video', { required: true })}
                      onChange={(e) => {
                        register('video').onChange(e)
                        if (e.target.files[0]) setVideoName(e.target.files[0].name)
                      }}
                    />
                  </label>
                </div>

                <button
                  type='submit'
                  disabled={isPending}
                  className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50'
                >
                  {isPending ? <><Spinner /> Uploading...</> : 'Create Module'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modules Grid */}
      {(!data?.modules || data.modules.length === 0) ? (
        <div className='surface-lg p-16 text-center'>
          <PlayCircle className='w-12 h-12 text-zinc-700 mx-auto mb-4' />
          <h3 className='text-base font-bold text-white mb-1'>No modules yet</h3>
          <p className='text-zinc-600 text-sm'>Add your first module to get started</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {data.modules.map((item, index) => (
            <div
              key={item._id || index}
              className='surface-lg p-5 hover:border-indigo-500/25 transition-all duration-200'
            >
              <div className='flex items-start gap-3.5 mb-4'>
                <div className='w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-500/20'>
                  <PlayCircle className='w-4.5 h-4.5 text-indigo-400' size={18} />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-white text-sm leading-snug line-clamp-2'>{item.title}</h3>
                  <p className='text-xs text-zinc-600 mt-0.5'>Module {index + 1}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-xs font-medium text-zinc-700 bg-zinc-800/80 border border-white/5 px-2 py-0.5 rounded-lg'>
                  Video
                </span>
                {item.quiz && (
                  <span className='text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-lg'>
                    Quiz
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CreateModule
