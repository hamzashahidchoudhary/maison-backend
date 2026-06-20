import prisma from '../lib/prisma.js'

// Recalculate and save a product's average rating + review count
const updateProductRatingStats = async (productId) => {
  const reviews = await prisma.review.findMany({ where: { productId } })
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round(avgRating * 10) / 10, // round to 1 decimal
      reviews: reviewCount,
    }
  })
}

// GET /products/:id/reviews
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: Number(req.params.id) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(reviews)
  } catch (err) {
    console.error('Get reviews error:', err)
    res.status(500).json({ error: 'Failed to fetch reviews.' })
  }
}

// POST /products/:id/reviews
export const createReview = async (req, res) => {
  try {
    const productId = Number(req.params.id)
    const { rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' })
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Please write a comment.' })
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId: req.user.id } }
    })
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product.' })
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        rating: Number(rating),
        comment: comment.trim(),
      },
      include: { user: { select: { name: true } } }
    })

    await updateProductRatingStats(productId)

    res.status(201).json(review)
  } catch (err) {
    console.error('Create review error:', err)
    res.status(500).json({ error: 'Failed to create review.' })
  }
}

// DELETE /products/:id/reviews/:reviewId (user can delete own, admin can delete any)
export const deleteReview = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: Number(req.params.reviewId) } })
    if (!review) return res.status(404).json({ error: 'Review not found.' })

    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You can only delete your own reviews.' })
    }

    await prisma.review.delete({ where: { id: review.id } })
    await updateProductRatingStats(review.productId)

    res.json({ message: 'Review deleted.' })
  } catch (err) {
    console.error('Delete review error:', err)
    res.status(500).json({ error: 'Failed to delete review.' })
  }
}
