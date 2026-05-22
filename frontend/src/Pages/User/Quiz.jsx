import { useGetQuiz } from '@/hooks/quiz.hook'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Brain } from 'lucide-react'

const Quiz = () => {
  const { id } = useParams()
  const { data, isLoading } = useGetQuiz(id)
  const navigate = useNavigate()
  const [selected, setSelected] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const questions = data?.quiz?.questions || []
  const total = questions.length
  const answered = Object.keys(selected).length
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    let correct = 0
    questions.forEach((q) => { if (selected[q._id] === q.correctOption) correct++ })
    setScore(correct)
    setShowResult(true)
  }

  const handleRetake = () => { setShowResult(false); setSelected({}); setScore(0) }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#09090b] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4' />
          <p className='text-zinc-600 text-sm'>Loading quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#09090b] py-10 px-4'>
      <div className='max-w-2xl mx-auto'>

        {showResult ? (
          /* ── Results ── */
          <div className='surface-lg overflow-hidden'>
            {/* Score header */}
            <div className='bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent
              border-b border-white/5 p-8 text-center'>
              <div className='w-16 h-16 bg-indigo-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/25'>
                <Trophy className='w-8 h-8 text-indigo-400' />
              </div>
              <h1 className='text-2xl font-black text-white mb-1'>Quiz Complete!</h1>
              <p className='text-zinc-500 text-sm'>Here's how you did</p>

              <div className='mt-6 inline-block'>
                <div className='text-5xl font-black text-white'>
                  {score}<span className='text-2xl text-zinc-600'>/{total}</span>
                </div>
                <p className={`text-lg font-bold mt-1 ${
                  percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {percentage}% Correct
                </p>
              </div>

              <p className='text-zinc-400 mt-3 text-sm'>
                {percentage === 100 ? 'Perfect Score!' : percentage >= 70 ? 'Great Job!' : percentage >= 50 ? 'Good Effort!' : 'Keep Learning!'}
              </p>
            </div>

            {/* Review */}
            <div className='p-6 space-y-4'>
              <h3 className='text-sm font-bold text-zinc-400 uppercase tracking-wider'>Review Answers</h3>
              {questions.map((q, i) => {
                const userAns = selected[q._id]
                const correct = userAns === q.correctOption
                return (
                  <div key={q._id}
                    className={`p-4 rounded-xl border ${correct ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                    <div className='flex items-start gap-3 mb-3'>
                      {correct
                        ? <CheckCircle2 className='w-4.5 h-4.5 text-green-400 flex-shrink-0 mt-0.5' />
                        : <XCircle className='w-4.5 h-4.5 text-red-400 flex-shrink-0 mt-0.5' />}
                      <div className='flex-1'>
                        <p className='text-xs text-zinc-600 mb-1'>Q{i+1}</p>
                        <p className='text-sm font-semibold text-zinc-200'>{q.content}</p>
                      </div>
                    </div>
                    <div className='ml-7 space-y-1 text-xs'>
                      <p className='text-zinc-500'>
                        Your answer: <span className={correct ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                          {userAns || 'No answer'}
                        </span>
                      </p>
                      {!correct && (
                        <p className='text-zinc-500'>
                          Correct: <span className='text-green-400 font-semibold'>{q.correctOption}</span>
                        </p>
                      )}
                      {q.explanation && (
                        <p className='text-zinc-600 pt-2 border-t border-white/5 mt-2 leading-relaxed'>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className='p-6 border-t border-white/5 flex gap-3'>
              <button onClick={() => navigate(-1)}
                className='flex-1 btn-ghost py-2.5 text-sm flex items-center justify-center gap-2'>
                <ArrowLeft className='w-4 h-4' /> Back
              </button>
              <button onClick={handleRetake}
                className='flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2'>
                <RotateCcw className='w-4 h-4' /> Retake
              </button>
            </div>
          </div>
        ) : (
          /* ── Quiz form ── */
          <div>
            {/* Header card */}
            <div className='surface-lg p-5 mb-5'>
              <button onClick={() => navigate(-1)}
                className='flex items-center gap-1.5 text-zinc-600 hover:text-white text-sm transition-colors mb-4'>
                <ArrowLeft className='w-4 h-4' /> Back
              </button>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-9 h-9 bg-indigo-500/15 rounded-xl flex items-center justify-center border border-indigo-500/25'>
                  <Brain className='w-4.5 h-4.5 text-indigo-400' />
                </div>
                <div>
                  <h1 className='text-base font-black text-white'>AI Quiz</h1>
                  <p className='text-xs text-zinc-600'>{total} questions</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className='space-y-1.5'>
                <div className='flex justify-between text-xs text-zinc-600'>
                  <span>Progress</span>
                  <span className='text-indigo-400 font-semibold'>{answered}/{total} answered</span>
                </div>
                <div className='progress-bar'>
                  <div className='progress-fill' style={{ width: `${total > 0 ? (answered/total)*100 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Questions */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {questions.map((q, i) => (
                <div key={q._id} className='surface-lg p-5'>
                  <div className='mb-4'>
                    <span className='badge-indigo text-xs mb-2 inline-block'>Question {i+1} of {total}</span>
                    <p className='text-sm font-semibold text-zinc-200 leading-relaxed'>{q.content}</p>
                  </div>
                  <div className='space-y-2'>
                    {q.options.map((opt, oi) => {
                      const isSel = selected[q._id] === opt
                      return (
                        <label key={oi}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all
                            ${isSel
                              ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                              : 'border-white/6 hover:border-white/15 hover:bg-white/3 text-zinc-400'}`}>
                          <input
                            type='radio'
                            name={`q-${q._id}`}
                            value={opt}
                            checked={isSel}
                            onChange={() => setSelected(p => ({ ...p, [q._id]: opt }))}
                            className='accent-indigo-500'
                          />
                          <span className='text-sm font-medium'>{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Submit */}
              <button
                type='submit'
                disabled={answered < total}
                className='btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none'
              >
                {answered < total ? `Answer All Questions (${answered}/${total})` : 'Submit Quiz'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
