import { useGetCertificate } from '@/hooks/progress.hook'
import { useUserStore } from '@/Store/user.store'
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Award, Printer, ArrowLeft, GraduationCap, CheckCircle2, Loader2 } from 'lucide-react'

const Certificate = () => {
  const { id } = useParams()
  const { user } = useUserStore()
  const { data, isLoading, isError } = useGetCertificate(id)

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#09090b] flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3' />
          <p className='text-zinc-500 text-sm'>Verifying completion...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='min-h-screen bg-[#09090b] flex items-center justify-center px-6'>
        <div className='max-w-sm w-full surface-lg p-10 text-center'>
          <div className='w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-500/20'>
            <Award className='w-7 h-7 text-red-400' />
          </div>
          <h1 className='text-lg font-black text-white mb-2'>Not Yet Earned</h1>
          <p className='text-zinc-600 text-sm mb-7 leading-relaxed'>
            Complete all modules in this course to unlock your certificate.
          </p>
          <Link to='/YourCourse'>
            <button className='btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back to My Courses
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const completionDate = data.completedAt
    ? new Date(data.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className='min-h-screen bg-[#09090b]'>
      {/* Controls bar — hidden on print */}
      <div className='print:hidden border-b border-white/5 bg-zinc-950/80 backdrop-blur px-6 py-3 flex items-center justify-between'>
        <Link to='/YourCourse' className='flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors'>
          <ArrowLeft size={15} />
          My Courses
        </Link>
        <button
          onClick={() => window.print()}
          className='btn-primary flex items-center gap-2 px-4 py-2 text-sm'
        >
          <Printer size={14} />
          Download / Print
        </button>
      </div>

      {/* Certificate card — centered in screen */}
      <div className='flex items-center justify-center min-h-[calc(100vh-57px)] p-8 print:p-0 print:min-h-screen'>
        {/*
          The actual printable certificate.
          @media print in index.css makes bg white and text dark for clean output.
        */}
        <div
          id='certificate'
          className='
            certificate-card
            w-full max-w-3xl
            bg-white
            rounded-2xl print:rounded-none
            shadow-2xl
            border border-white/8 print:border-0
            overflow-hidden
            print:w-full print:max-w-none print:shadow-none
          '
          style={{ aspectRatio: '1.414 / 1' }}
        >
          {/* Top accent bar */}
          <div className='h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400' />

          <div className='flex flex-col items-center justify-between h-[calc(100%-8px)] px-14 py-10'>
            {/* Brand */}
            <div className='flex items-center gap-2.5'>
              <div className='w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center'>
                <GraduationCap className='w-4.5 h-4.5 text-white' size={18} />
              </div>
              <span className='text-lg font-black text-zinc-900 tracking-tight'>EduSmart</span>
            </div>

            {/* Center content */}
            <div className='text-center flex-1 flex flex-col items-center justify-center gap-4'>
              {/* Award icon */}
              <div className='w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center'>
                <Award className='w-8 h-8 text-amber-500' />
              </div>

              <div>
                <p className='text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2'>Certificate of Completion</p>
                <p className='text-sm text-zinc-500 mb-1'>This is to certify that</p>
                <h1 className='text-4xl font-black text-zinc-900 tracking-tight mb-1' style={{ fontFamily: 'Georgia, serif' }}>
                  {data.studentName || user?.fullName || 'Student'}
                </h1>
                <p className='text-sm text-zinc-500 mb-3'>has successfully completed the course</p>
                <h2 className='text-xl font-bold text-indigo-700 max-w-lg mx-auto leading-snug'>
                  {data.courseTitle}
                </h2>
              </div>

              {/* Verified badge */}
              <div className='flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5'>
                <CheckCircle2 className='w-3.5 h-3.5 text-green-600' />
                <span className='text-xs font-semibold text-green-700'>All modules completed</span>
              </div>
            </div>

            {/* Footer */}
            <div className='w-full flex items-end justify-between'>
              <div className='text-left'>
                <p className='text-xs text-zinc-400 mb-0.5'>Completion date</p>
                <p className='text-sm font-semibold text-zinc-700'>{completionDate}</p>
              </div>

              {/* Signature line */}
              <div className='text-center'>
                <div className='w-32 border-b border-zinc-300 mb-1' />
                <p className='text-xs font-semibold text-zinc-700'>EduSmart</p>
                <p className='text-xs text-zinc-400'>Platform Signature</p>
              </div>

              <div className='text-right'>
                <p className='text-xs text-zinc-400 mb-0.5'>Certificate ID</p>
                <p className='text-xs font-mono text-zinc-500'>{id?.slice(-10).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          #certificate {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Certificate
