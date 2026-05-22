import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  lastWatchedModule: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', default: null },
}, { timestamps: true })

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const Progress = mongoose.model('Progress', progressSchema)
