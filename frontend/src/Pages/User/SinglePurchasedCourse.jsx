import { useGetPurchaseCourse } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useModuleStores } from '@/Store/module.store'
import { useGetComment } from '@/hooks/module.hook'
import { useForm } from 'react-hook-form'
import { useCreateComment } from '@/hooks/comment.hook'
import { useCheckQuiz, useCreateQuiz } from '@/hooks/quiz.hook'
import { MessageCircle, Send, PlayCircle, FileQuestion, Trophy, CheckCircle, Layers, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const SinglePurchasedCourse = () => {
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()
  const { setModule, module } = useModuleStores()
  const { id } = useParams()
  const { data } = useGetPurchaseCourse(id)
  const { data: commentsData } = useGetComment(module?._id)
  const { data: quizStatus } = useCheckQuiz(module?._id)
  const { mutate: createQuiz } = useCreateQuiz()
  const { mutate: postComment } = useCreateComment()

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

  const moduleCount = data?.modules?.length || 0
  const completedModules = 0

  return (
    <div className='flex h-screen bg-slate-100 overflow-hidden'>

      {/* LEFT: Video + Comments */}
      <div className='flex flex-col w-[55%] min-w-0 border-r border-slate-200'>

        {/* Video player */}
        <div className='relative bg-slate-900 flex-shrink-0' style={{ height: '52%' }}>
          {module?.video ? (
            <video
              key={module._id}
              className='w-full h-full object-contain'
              src={module.video}
              controls
              autoPlay={false}
            />
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500'>
              <PlayCircle className='w-16 h-16 opacity-30' />
              <p className='text-sm font-medium opacity-60'>Select a module to start watching</p>
            </div>
          )}

          {module && (
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4'>
              <p className='text-white font-semibold text-sm truncate'>{module.title}</p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className='flex flex-col flex-1 bg-white min-h-0'>
          <div className='flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 flex-shrink-0'>
            <MessageCircle className='w-4 h-4 text-slate-500' />
            <span className='text-sm font-bold text-slate-800'>Discussion</span>
            <span className='text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium'>
              {commentsData?.length || 0}
            </span>
          </div>

          <div className='flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0'>
            {commentsData?.length ? (
              commentsData.map((item, i) => (
                <div key={item._id || i} className='flex gap-3'>
                  <Avatar className='w-8 h-8 flex-shrink-0 mt-0.5'>
                    <AvatarFallback className='bg-emerald-100 text-emerald-700 text-xs font-bold'>
                      {item.userId?.fullName?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-baseline gap-2 mb-1'>
                      <span className='text-xs font-bold text-slate-800'>
                        {item.userId?.fullName || 'Anonymous'}
                      </span>
                      <span className='text-xs text-slate-400'>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className='text-sm text-slate-700 leading-relaxed'>{item.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center py-10 text-center'>
                <MessageCircle className='w-10 h-10 text-slate-200 mb-3' />
                <p className='text-sm text-slate-400'>No comments yet — be the first!</p>
              </div>
            )}
          </div>

          <div className='px-5 py-3 border-t border-slate-100 flex-shrink-0'>
            <form onSubmit={handleSubmit(commentHandler)} className='flex gap-2'>
              <input
                type='text'
                placeholder={module ? 'Ask a question or share a thought...' : 'Select a module first'}
                disabled={!module?._id}
                className='flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                {...register('comment', { required: true })}
              />
              <button type='submit' disabled={!module?._id}
                className='px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl
                  flex items-center gap-1.5 text-sm font-semibold disabled:opacity-50
                  disabled:cursor-not-allowed transition-all shadow-sm'>
                <Send className='w-3.5 h-3.5' />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT: Course content */}
      <div className='flex flex-col flex-1 bg-white min-w-0 overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-slate-100 flex-shrink-0'>
          <button onClick={() => navigate('/YourCourse')}
            className='flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium mb-3 transition-colors'>
            <ArrowLeft size={13} />
            My Courses
          </button>
          <h2 className='font-black text-slate-900 text-base line-clamp-1'>{data?.title}</h2>
          <div className='flex items-center gap-3 mt-2'>
            <span className='flex items-center gap-1 text-xs text-slate-500'>
              <Layers size={12} />
              {moduleCount} modules
            </span>
            <span className='flex items-center gap-1 text-xs text-emerald-600 font-semibold'>
              <CheckCircle size={12} />
              {completedModules} completed
            </span>
          </div>
        </div>

        {/* Module list */}
        <div className='flex-1 overflow-y-auto px-4 py-4'>
          {data?.modules?.length ? (
            <div className='space-y-2'>
              {data.modules.map((item, index) => {
                const isActive = module?._id === item._id
                return (
                  <Accordion key={item._id || index} type='single' collapsible>
                    <AccordionItem value={`mod-${index}`}
                      className={`border rounded-xl overflow-hidden transition-all ${isActive ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}>
                      <AccordionTrigger
                        onClick={() => setModule(item)}
                        className='px-4 py-3 hover:bg-slate-50 transition-colors text-left w-full'
                      >
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0
                            ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {index + 1}
                          </div>
                          <span className={`text-sm font-semibold truncate ${isActive ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {item.title}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className='px-4 pb-3 border-t border-slate-100 bg-slate-50/50'>
                        <div className='flex gap-2 pt-3'>
                          {!item.quiz ? (
                            <button onClick={() => createQuizHandler(item)}
                              className='flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg transition-all'>
                              <FileQuestion size={13} />
                              Generate Quiz
                            </button>
                          ) : (
                            <button onClick={() => navigate(`/quiz/${item.quiz}`)}
                              className='flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm'>
                              <Trophy size={13} />
                              Take Quiz
                            </button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-center py-16'>
              <Layers className='w-12 h-12 text-slate-200 mb-3' />
              <p className='text-sm text-slate-400'>No modules available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SinglePurchasedCourse
