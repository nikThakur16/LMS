import { useGetPurchaseCourse } from '@/hooks/course.hook'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useModuleStores } from '@/Store/module.store'
import { useGetComment } from '@/hooks/module.hook'
import { useForm } from 'react-hook-form'
import { useCreateComment } from '@/hooks/comment.hook'
import { useCreateQuiz } from '@/hooks/quiz.hook'
import { useMarkComplete, useGetProgress } from '@/hooks/progress.hook'
import { useSaveNote, useGetNote } from '@/hooks/note.hook'
import {
  MessageCircle, Send, PlayCircle, FileQuestion, Trophy,
  CheckCircle2, Layers, ArrowLeft, StickyNote, CheckCheck,
  ChevronRight, Award
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const SinglePurchasedCourse = () => {
  const { register, handleSubmit, reset } = useForm()
  const { register: noteRegister, handleSubmit: noteSubmit, setValue } = useForm()
  const navigate = useNavigate()
  const { setModule, module } = useModuleStores()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('discussion')

  const { data } = useGetPurchaseCourse(id)
  const { data: commentsData } = useGetComment(module?._id)
  const { mutate: createQuiz } = useCreateQuiz()
  const { mutate: postComment } = useCreateComment()
  const { mutate: markComplete } = useMarkComplete()
  const { data: progressData } = useGetProgress(id)
  const { data: noteData } = useGetNote(module?._id)
  const { mutate: saveNote } = useSaveNote()

  const completedModules = progressData?.completedModules || []
  const moduleCount = data?.modules?.length || 0
  const completedCount = completedModules.length
  const progressPercent = moduleCount > 0 ? Math.round((completedCount / moduleCount) * 100) : 0

  const isCompleted = (moduleId) => completedModules.map(String).includes(String(moduleId))

  useEffect(() => {
    setValue('content', noteData?.content || '')
  }, [noteData?.content, module?._id, setValue])

  const createQuizHandler = (mod) => {
    createQuiz(
      { moduleId: mod._id, content: mod.title },
      { onSuccess: () => toast.success('Quiz generated!') }
    )
  }

  const commentHandler = (formData) => {
    postComment(
      { id: module?._id, payload: formData },
      { onSuccess: () => { reset(); toast.success('Comment posted!') } }
    )
  }

  const markCompleteHandler = () => {
    if (!module?._id) return
    markComplete(
      { moduleId: module._id, courseId: id },
      { onSuccess: () => toast.success('Module marked complete!') }
    )
  }

  const saveNoteHandler = (formData) => {
    if (!module?._id) return
    saveNote(
      { moduleId: module._id, content: formData.content },
      { onSuccess: () => toast.success('Note saved!') }
    )
  }

  return (
    <div className='flex h-screen bg-[#09090b] overflow-hidden'>

      {/* LEFT: Video + Tabs */}
      <div className='flex flex-col w-[58%] min-w-0 border-r border-white/5'>

        {/* Video player */}
        <div className='relative bg-black flex-shrink-0' style={{ height: '55%' }}>
          {module?.video ? (
            <video
              key={module._id}
              className='w-full h-full object-contain'
              src={module.video}
              controls
              autoPlay={false}
            />
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-700'>
              <PlayCircle className='w-14 h-14 opacity-30' />
              <p className='text-sm font-medium'>Select a module to start watching</p>
            </div>
          )}

          {/* Module title + complete button overlay */}
          {module && (
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-5 py-4'>
              <div className='flex items-center justify-between gap-4'>
                <p className='text-white font-semibold text-sm truncate flex-1'>{module.title}</p>
                {!isCompleted(module._id) ? (
                  <button
                    onClick={markCompleteHandler}
                    className='flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20
                      hover:bg-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-lg
                      border border-indigo-500/30 transition-all whitespace-nowrap flex-shrink-0'
                  >
                    <CheckCheck className='w-3.5 h-3.5' />
                    Mark Complete
                  </button>
                ) : (
                  <span className='flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15
                    text-green-400 text-xs font-semibold rounded-lg border border-green-500/25 flex-shrink-0'>
                    <CheckCircle2 className='w-3.5 h-3.5' />
                    Completed
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className='flex-1 flex flex-col bg-zinc-950/50 min-h-0'>
          <div className='flex border-b border-white/5 flex-shrink-0'>
            {['discussion', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold capitalize transition-colors
                  ${activeTab === tab
                    ? 'text-white border-b-2 border-indigo-500 -mb-px'
                    : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                {tab === 'discussion'
                  ? <MessageCircle className='w-3.5 h-3.5' />
                  : <StickyNote className='w-3.5 h-3.5' />}
                {tab}
                {tab === 'discussion' && commentsData?.length > 0 && (
                  <span className='bg-zinc-800 text-zinc-400 text-xs px-1.5 py-0.5 rounded-md'>
                    {commentsData.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Discussion tab */}
          {activeTab === 'discussion' && (
            <>
              <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0'>
                {commentsData?.length ? commentsData.map((item, i) => (
                  <div key={item._id || i} className='flex gap-3'>
                    <Avatar className='w-7 h-7 flex-shrink-0 mt-0.5'>
                      <AvatarFallback className='bg-indigo-500/20 text-indigo-300 text-xs font-bold'>
                        {item.userId?.fullName?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-baseline gap-2 mb-1'>
                        <span className='text-xs font-semibold text-zinc-300'>
                          {item.userId?.fullName || 'Anonymous'}
                        </span>
                        <span className='text-xs text-zinc-700'>
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className='text-sm text-zinc-400 leading-relaxed'>{item.comment}</p>
                    </div>
                  </div>
                )) : (
                  <div className='flex flex-col items-center justify-center py-10 text-center'>
                    <MessageCircle className='w-8 h-8 text-zinc-800 mb-3' />
                    <p className='text-sm text-zinc-700'>No comments yet — be the first!</p>
                  </div>
                )}
              </div>
              <div className='px-4 py-3 border-t border-white/5 flex-shrink-0'>
                <form onSubmit={handleSubmit(commentHandler)} className='flex gap-2'>
                  <input
                    type='text'
                    placeholder={module ? 'Ask a question...' : 'Select a module first'}
                    disabled={!module?._id}
                    className='input-dark flex-1 px-3 py-2 text-sm'
                    {...register('comment', { required: true })}
                  />
                  <button type='submit' disabled={!module?._id}
                    className='btn-primary px-3 py-2 flex items-center'>
                    <Send className='w-3.5 h-3.5' />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Notes tab */}
          {activeTab === 'notes' && (
            <div className='flex-1 flex flex-col p-4 min-h-0'>
              {module?._id ? (
                <form onSubmit={noteSubmit(saveNoteHandler)} className='flex flex-col flex-1 gap-3'>
                  <p className='text-xs text-zinc-600 font-medium'>
                    Notes for: <span className='text-zinc-400'>{module.title}</span>
                  </p>
                  <textarea
                    {...noteRegister('content')}
                    placeholder='Write your notes here...'
                    className='input-dark flex-1 p-3 text-sm resize-none min-h-0'
                  />
                  <button type='submit' className='btn-primary py-2 text-sm self-end px-5'>
                    Save Note
                  </button>
                </form>
              ) : (
                <div className='flex flex-col items-center justify-center flex-1 text-center'>
                  <StickyNote className='w-8 h-8 text-zinc-800 mb-3' />
                  <p className='text-sm text-zinc-700'>Select a module to take notes</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Module sidebar */}
      <div className='flex flex-col flex-1 bg-zinc-950 min-w-0 overflow-hidden'>
        {/* Header */}
        <div className='px-5 py-4 border-b border-white/5 flex-shrink-0'>
          <button onClick={() => navigate('/YourCourse')}
            className='flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 font-medium mb-3 transition-colors'>
            <ArrowLeft size={12} /> My Courses
          </button>
          <h2 className='font-bold text-white text-sm line-clamp-1 mb-3'>{data?.title}</h2>

          {/* Progress */}
          <div className='space-y-1.5'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-zinc-600 flex items-center gap-1'>
                <Layers size={11} /> {moduleCount} modules
              </span>
              <span className='text-indigo-400 font-semibold'>{progressPercent}% complete</span>
            </div>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {progressPercent === 100 && (
            <button
              onClick={() => navigate(`/certificate/${id}`)}
              className='mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg
                bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-semibold
                border border-amber-500/25 transition-all'
            >
              <Award className='w-3.5 h-3.5' />
              Get Your Certificate
            </button>
          )}
        </div>

        {/* Module list */}
        <div className='flex-1 overflow-y-auto px-3 py-3'>
          {data?.modules?.length ? (
            <div className='space-y-1'>
              {data.modules.map((item, index) => {
                const isActive = module?._id === item._id
                const done = isCompleted(item._id)
                return (
                  <div key={item._id || index}>
                    <button
                      onClick={() => setModule(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                        ${isActive
                          ? 'bg-indigo-500/15 border border-indigo-500/25'
                          : 'hover:bg-white/4 border border-transparent'}`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                        ${done ? 'bg-green-500/20 text-green-400'
                          : isActive ? 'bg-indigo-500 text-white'
                          : 'bg-zinc-800 text-zinc-500'}`}>
                        {done ? <CheckCircle2 size={13} /> : index + 1}
                      </div>
                      <span className={`text-xs font-medium line-clamp-2 flex-1 text-left
                        ${isActive ? 'text-indigo-300' : done ? 'text-zinc-600' : 'text-zinc-300'}`}>
                        {item.title}
                      </span>
                      {isActive && <ChevronRight size={12} className='text-indigo-400 flex-shrink-0' />}
                    </button>

                    {/* Quiz buttons — shown when this module is active */}
                    {isActive && (
                      <div className='px-3 pb-2 flex gap-2'>
                        {!item.quiz ? (
                          <button onClick={() => createQuizHandler(item)}
                            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
                              bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 transition-all'>
                            <FileQuestion size={12} />
                            Generate Quiz
                          </button>
                        ) : (
                          <button onClick={() => navigate(`/quiz/${item.quiz}`)}
                            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
                              bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-400
                              border border-indigo-500/25 transition-all'>
                            <Trophy size={12} />
                            Take Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-center py-12'>
              <Layers className='w-10 h-10 text-zinc-800 mb-3' />
              <p className='text-sm text-zinc-700'>No modules yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SinglePurchasedCourse
