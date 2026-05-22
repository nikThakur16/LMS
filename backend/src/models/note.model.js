import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  content: { type: String, default: '' },
}, { timestamps: true })

noteSchema.index({ userId: 1, moduleId: 1 }, { unique: true })

export const Note = mongoose.model('Note', noteSchema)
