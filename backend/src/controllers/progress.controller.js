import { Course } from '../models/course.model.js'
import { Progress } from '../models/progress.model.js'

export const markModuleComplete = async (req, res) => {
  try {
    const { moduleId, courseId } = req.body
    const userId = req.user._id

    let progress = await Progress.findOne({ userId, courseId })
    if (!progress) {
      progress = new Progress({ userId, courseId, completedModules: [], lastWatchedModule: null })
    }

    if (!progress.completedModules.map(String).includes(String(moduleId))) {
      progress.completedModules.push(moduleId)
    }
    progress.lastWatchedModule = moduleId
    await progress.save()

    return res.status(200).json({ success: true, progress })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user._id

    const [progress, course] = await Promise.all([
      Progress.findOne({ userId, courseId }),
      Course.findById(courseId).select('modules'),
    ])

    const totalModules = course?.modules?.length || 0
    const completedCount = progress?.completedModules?.length || 0

    return res.status(200).json({
      completedModules: progress?.completedModules || [],
      lastWatchedModule: progress?.lastWatchedModule || null,
      totalModules,
      completedCount,
      percentage: totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getCertificateData = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user._id

    const [progress, course] = await Promise.all([
      Progress.findOne({ userId, courseId }),
      Course.findById(courseId).select('title modules'),
    ])

    if (!course) return res.status(404).json({ message: 'Course not found' })

    const totalModules = course.modules?.length || 0
    const completedCount = progress?.completedModules?.length || 0

    if (totalModules === 0 || completedCount < totalModules) {
      return res.status(403).json({ message: 'Course not yet completed' })
    }

    return res.status(200).json({
      studentName: req.user.fullName,
      courseTitle: course.title,
      completionDate: progress.updatedAt,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
