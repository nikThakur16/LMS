import { Review } from '../models/review.model.js'

export const createOrUpdateReview = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body
    const userId = req.user._id

    const updated = await Review.findOneAndUpdate(
      { userId, courseId },
      { rating, review },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('userId', 'fullName profilePhoto')

    return res.status(200).json({ success: true, review: updated })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params

    const reviews = await Review.find({ courseId })
      .populate('userId', 'fullName profilePhoto')
      .sort({ createdAt: -1 })

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return res.status(200).json({
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
