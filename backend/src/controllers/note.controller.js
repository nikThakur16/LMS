import { Note } from '../models/note.model.js'

export const saveNote = async (req, res) => {
  try {
    const { moduleId, content } = req.body
    const userId = req.user._id

    const note = await Note.findOneAndUpdate(
      { userId, moduleId },
      { content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json({ success: true, note })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getNote = async (req, res) => {
  try {
    const { moduleId } = req.params
    const userId = req.user._id

    const note = await Note.findOne({ userId, moduleId })
    return res.status(200).json({ content: note?.content || '' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
